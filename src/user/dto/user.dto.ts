import { IsString, IsNotEmpty } from "class-validator";

export class editUserDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    lastName: string;
}