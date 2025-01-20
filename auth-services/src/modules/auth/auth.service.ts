import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/common/dto/login-user.dto';
import { DataServiceClient } from './data-service.client';
import { EnvConfig } from 'src/config/env-variables';
import { UserRegistrationFailedException } from '../exceptions/user-registration-failed.exception';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception';
import { CreateUserDto } from 'src/common/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly envConfig: EnvConfig,
        private readonly jwtService: JwtService,
        private readonly dataServiceClient: DataServiceClient,
    ) { }

    async registerUser(username: string, email: string, password: string): Promise<void> {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = { username, email, password: hashedPassword };

        try {
            await this.dataServiceClient.createUserInDataService(user);
            console.log(`User registered with email: ${email}`);
        } catch (error) {

            if (error.response && error.response.status === 400) {
                throw new UserRegistrationFailedException(error.response.data.message);
            }
            console.error('Error registering user:', error);
            throw new UserRegistrationFailedException();
        }
    }

    async login(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;

        const user = await this.dataServiceClient.findUserByEmail(email); // Usando 'await' para garantir que seja resolvido

        if (!user) {
            throw new UserNotFoundException(email);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new InvalidCredentialsException();
        }

        const payload = { email: user.email, sub: user.username };
        return {
            access_token: await this.jwtService.signAsync(payload, { secret: this.envConfig.jwtSecret }),
        };
    }

    async getUserById(id: number): Promise<any> {
        try {
            const user = await this.dataServiceClient.findUserById(id);
            if (!user) {
                throw new UserNotFoundException(`User with ID ${id} not found`);
            }
            return user;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw new UserNotFoundException(`User with ID ${id} not found`);
        }
    }

    async getAllUsers(): Promise<any[]> {
        try {
            const users = await this.dataServiceClient.findAllUsers();
            return users;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw new Error('Failed to fetch users.');
        }
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.dataServiceClient.findUserByEmail(email);

        if (!user) {
            throw new UserNotFoundException(email);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async generateJwtToken(user: any): Promise<string> {
        const payload = { email: user.email, sub: user.id };
        return this.jwtService.sign(payload);
    }

    async updateUser(id: number, updateUserDto: Partial<CreateUserDto>): Promise<void> {

        const updateData = Object.fromEntries(
            Object.entries(updateUserDto).filter(([_, value]) => value !== undefined)
        );
        if (Object.keys(updateData).length === 0) {
            throw new Error('No fields provided for update.');
        }

        if (updateData.password) {
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(updateData.password, saltRounds);
        }
        await this.dataServiceClient.updateUser(id, updateData);
    }

    async deleteUser(id: number): Promise<void> {
        await this.dataServiceClient.deleteUser(id);
    }
}
