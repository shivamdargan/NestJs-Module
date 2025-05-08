import { ForbiddenException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { payloadJwt } from "./index";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
 export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){ 
    constructor(config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET') as string,
        });
    }

    async validate(payload:payloadJwt) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
            },
        });
        if(!user) {
            return null;
        }
        else{
            const {hash, ...rest} = user;
            return rest;
        }
    }
}