import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/common/dto/login-user.dto';
import { DataServiceClient } from './data-service.client';
import { EnvConfig } from 'src/config/env-variables';
import { UserRegistrationFailedException } from '../exceptions/user-registration-failed.exception';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception';

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
}
