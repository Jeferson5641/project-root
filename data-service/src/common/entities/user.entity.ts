import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @IsOptional()
    @PrimaryGeneratedColumn()
    id?: number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Column()
    username?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Column()
    email?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Column()
    password?: string;
}