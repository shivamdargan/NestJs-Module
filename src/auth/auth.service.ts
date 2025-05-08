import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { JwtService } from "@nestjs/jwt";
import { access } from "fs";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class AuthService{

    constructor(private prismaService: PrismaService, private jwt: JwtService, private config:ConfigService){}

    async signin(dto: AuthDto){
        // find the user by email
        const user = await this.prismaService.user.findUnique({
            where: {
                email: dto.email,
            }
        });

        // if user does not exist throw exception
        if(!user) throw new ForbiddenException('Credentials incorrect');

        // compare password
        const passwordMatches = await argon.verify(user.hash, dto.password);

        // if password is incorrect throw exception
        if(!passwordMatches) throw new ForbiddenException('Credentials incorrect');

      // return the token
      return this.signToken(user.id, user.email);
    }

    async signup(dto:AuthDto){
        const hash = await argon.hash(dto.password);

        try{
            const user = await this.prismaService.user.create({
                data: {
                    email: dto.email,
                    hash,
                }
            });
           
            return this.signToken(user.id, user.email);

        }
        catch (error) { 
            if (error.code === 'P2002') {
                throw new ForbiddenException('Credentials taken');
            }
            throw error;
        }
    }

    async signToken(userId: number, email: string) : Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email,
        }
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret:this.config.get('JWT_SECRET'),
        });

        return {
            access_token: token,
        };
    }
}