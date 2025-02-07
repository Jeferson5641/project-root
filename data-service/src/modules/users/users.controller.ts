import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CreateUserDto } from "src/common/dto/create-user.dto";
import { UsersService } from "./users.service";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('data')
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) { }

    @Post('create')
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    @ApiResponse({ status: 400, description: 'User registered failed' })
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
    @ApiResponse({ status: 200, description: 'User retrieved successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 403, description: 'Access denied' })
    async getUserById(@Param('id') id: number) {
        const user = await this.usersService.findUserById(id);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        return user;
    }

    @Get('all')
    @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
    @ApiResponse({ status: 403, description: 'Access denied' })
    async getAllUsers() {
        const users = await this.usersService.findAllUser();
        return users;
    }

    // Atualizar dados de um usuário
    @Put('update/:id')
    @ApiResponse({ status: 200, description: 'User updated successfully' })
    @ApiResponse({ status: 400, description: 'Failed to update user' })
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
    @ApiResponse({ status: 200, description: 'User deleted successfully' })
    @ApiResponse({ status: 400, description: 'Failed to delete user' })
    async deleteUser(@Param('id') id: number) {
        console.log(`Received request to delete user with ID ${id}`);
        await this.usersService.deleteUser(Number(id));
        console.log(`Successfully deleted user with ID ${id}(controller)`);
        return { message: `User with ID ${id} deleted successfully` };
    }
}