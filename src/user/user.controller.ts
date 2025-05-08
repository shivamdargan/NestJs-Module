import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard';
import { editUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

   constructor(private userService: UserService) {}

    @Get('me')
    getMe(@GetUser() user :User) {
        // This is a protected route
        // The user object is automatically populated by the AuthGuard
        return user;
    }

    @Patch('edit')
    editUser(@GetUser() user: User, @Body() editDto: editUserDto) {
        return this.userService.editUser(user.id, editDto);
    }
}
