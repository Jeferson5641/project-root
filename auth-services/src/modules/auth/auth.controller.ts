import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
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
}