import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ description: 'true' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ description: 'true' })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ description: 'true' })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
