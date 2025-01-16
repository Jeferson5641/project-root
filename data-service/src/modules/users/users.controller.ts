import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
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

    @Get('email/:email')
    async getUserByEmail(@Param('email') email: string) {
        const user = await this.usersService.findUserByEmail(email);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        return user;
    }

    @Get('one/:id')
    async getUserById(@Param('id') id: number) {
        const user = await this.usersService.findUserById(id);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        return user;
    }

    @Get('all')
    async getAllUsers() {
        const users = await this.usersService.findAllUser();
        return users;
    }

    // Atualizar dados de um usuário
    @Put('update/:id')
    async updateUser(
        @Param('id') id: number,
        @Body() updateUserDto: CreateUserDto,
    ) {
        const updatedUser = await this.usersService.updateUser(Number(id), updateUserDto);
        return {
            message: 'User updated successfully',
            user: updatedUser,
        };
    }

    // Excluir um usuário pelo ID
    @Delete('delete/:id')
    async deleteUser(@Param('id') id: number) {
        console.log(`Received request to delete user with ID ${id}`);
        await this.usersService.deleteUser(Number(id));
        console.log(`Successfully deleted user with ID ${id}(controller)`);
        return { message: `User with ID ${id} deleted successfully` };
    }
}