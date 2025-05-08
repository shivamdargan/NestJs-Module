import { ForbiddenException, Injectable } from '@nestjs/common';
import { editUserDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService){}

    editUser(id: number, editUserDto:editUserDto) {

        try{
            const editedUser = this.prismaService.user.update({
                where: {
                    id: id,
                },
                data: {
                    ...editUserDto,
                },
                select:{
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    createdAt: true,
                    updatedAt: true,
                }
            });

            return editedUser;
        }
        catch (error) {
            throw new ForbiddenException('User not found');
        }

    }
}
