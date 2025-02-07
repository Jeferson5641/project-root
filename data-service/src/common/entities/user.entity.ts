import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @IsOptional()
    @PrimaryGeneratedColumn()
    id?: number;

    @ApiProperty({ description: 'true' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Column()
    username?: string;

    @ApiProperty({ description: 'true' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Column()
    email?: string;

    @ApiProperty({ description: 'true' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Column()
    password?: string;
}