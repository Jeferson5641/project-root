import { Body, Controller, Delete, Get, Param, Post, Put, UnauthorizedException } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "src/common/dto/create-user.dto";
import { LoginUserDto } from "src/common/dto/login-user.dto";
import { AuthService } from "./auth.service";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    @ApiResponse({ status: 400, description: 'User registered failed' })
    async register(@Body() createUserDto: CreateUserDto) {
        await this.authService.registerUser(createUserDto.username, createUserDto.email, createUserDto.password);
        return { message: 'User registered successfully' };
    }

    @Post('login')
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 401, description: 'Invalid email or password' })
    @ApiResponse({ status: 403, description: 'Access denied' })
    @ApiBody({ type: LoginUserDto })
    async login(@Body() loginUserDto: LoginUserDto) {
        try {

            const token = await this.authService.login(loginUserDto);
            return {
                message: 'Login successful',
                access_token: token.access_token,
            };
        } catch (error) {
            console.error('Error logging in:', error);
            throw new UnauthorizedException('Invalid email or password');
        }
    }

    @Get('one/:id')
    async getUserById(@Param('id') id: string) {
        const user = await this.authService.getUserById(Number(id));
        return user;
    }

    @Get('all')
    async getAllUsers() {
        const users = await this.authService.getAllUsers();
        return users;
    }

    // Atualização de usuário
    @Put('update/:id')
    @ApiResponse({ status: 200, description: 'User updated successfully' })
    @ApiResponse({ status: 400, description: 'Failed to update user' })
    async updateUser(
        @Param('id') id: string,
        @Body() updateUserDto: Partial<CreateUserDto>,
    ) {
        await this.authService.updateUser(Number(id), updateUserDto);
        return { message: 'User updated successfully' };
    }

    // Exclusão de usuário
    @Delete('delete/:id')
    @ApiResponse({ status: 200, description: 'User deleted successfully' })
    @ApiResponse({ status: 400, description: 'Failed to delete user' })
    async deleteUser(@Param('id') id: number) {
        await this.authService.deleteUser(Number(id));
        return { message: `User with ID ${id} deleted successfully` };
    }
}