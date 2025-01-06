import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateUserDto } from "src/common/dto/create-user.dto";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) { }

    @Post('create')
    async create(@Body() userData: CreateUserDto) {
        await this.usersService.create(userData);
        return { message: 'User created successfully' };
    }

    // teste
    @Get(':username')
    async getUserByUsername(@Param('username') username: string) {
        return this.usersService.findUserByUsername(username);
    }
}