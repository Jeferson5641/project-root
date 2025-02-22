import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto {

    @ApiProperty({ description: 'true' })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'true' })
    @IsString()
    @IsNotEmpty()
    password: string;
}