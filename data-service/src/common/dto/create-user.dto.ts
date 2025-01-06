import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {

    id: number;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

}