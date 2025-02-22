import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/common/dto/create-user.dto';
import { LoginUserDto } from 'src/common/dto/login-user.dto';
import { EnvConfig } from 'src/config/env-variables';
import { GenericHttpException } from '../exceptions/generic-http.exception';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception';
import { NoFieldsProvidedException } from '../exceptions/no-fields-provided.exception';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';
import { UserRegistrationFailedException } from '../exceptions/user-registration-failed.exception';
import { DataServiceClient } from './data-service.client';

@Injectable()
export class AuthService {
    constructor(
        private readonly envConfig: EnvConfig,
        private readonly jwtService: JwtService,
        private readonly dataServiceClient: DataServiceClient,
    ) { }

    async registerUser(username: string, email: string, password: string): Promise<void> {
        const hashedPassword = await this.hashPassword(password);

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

        try {

            const user = await this.dataServiceClient.findUserByEmail(email); // Usando 'await' para garantir que seja resolvido

            if (!user) {
                throw new UserNotFoundException(email);
            }

            const isPasswordValid = await this.comparePasswords(password, user.password);

            if (!isPasswordValid) {
                throw new InvalidCredentialsException();
            }

            const payload = { email: user.email, sub: user.username };
            return {
                access_token: await this.jwtService.signAsync(payload, { secret: this.envConfig.jwtSecret }),
            };
        } catch (error) {
            console.error('Error during login: ', error);
            if (error instanceof UserNotFoundException || error instanceof InvalidCredentialsException) {
                throw error;
            }
            throw new GenericHttpException(error.response?.status || 'Failed to login.', 500);
        }

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
            if (error instanceof UserNotFoundException) {
                throw error;
            }
            throw new GenericHttpException(error.response?.status || `Failed to fetch user with ID ${id}.`, 500);
        }
    }

    async getAllUsers(): Promise<any[]> {
        try {
            const users = await this.dataServiceClient.findAllUsers();
            return users;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw new GenericHttpException(error.response?.status || 'Failed to fetch users.', 500);
        }
    }

    async validateUser(email: string, password: string): Promise<any> {
        try {
            const user = await this.dataServiceClient.findUserByEmail(email);

            if (!user) {
                throw new UserNotFoundException(email);
            }

            const isPasswordValid = await this.comparePasswords(password, user.password);

            if (isPasswordValid) {
                const { password, ...result } = user;
                return result;
            }
            throw new InvalidCredentialsException();
        } catch (error) {
            console.error('Error validation: ', error)
            if (error instanceof UserNotFoundException || error instanceof InvalidCredentialsException) {
                throw error;
            }
            throw new GenericHttpException(error.response?.status || 'Failed to validate user.', 500);
        }
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
            throw new NoFieldsProvidedException();
        }

        if (updateData.password) {
            updateData.password = await this.hashPassword(updateData.password);
        }

        try {
            await this.dataServiceClient.updateUser(id, updateData);
        } catch (error) {
            console.error('Error updating user:', error);
            throw new GenericHttpException(error.response?.status || `Failed to update user with ID ${id}.`, 500);
        }
    }

    async deleteUser(id: number): Promise<void> {
        try {
            await this.dataServiceClient.deleteUser(id);
        } catch (error) {
            console.error('Error deleting user:', error);
            throw new GenericHttpException(error.response?.status || `Failed to update user with ID ${id}.`, 500);
        }
    }

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    async comparePasswords(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}
