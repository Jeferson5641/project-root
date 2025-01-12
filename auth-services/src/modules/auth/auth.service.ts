import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/common/dto/login-user.dto';
import { InMemoryDbService } from 'src/common/moks/in-memory-db.service';
import { DataServiceClient } from './data-service.client';
// import { CreateUserDto } from 'src/common/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly inMemoryDbService: InMemoryDbService,
        private readonly jwtService: JwtService,
        private readonly dataServiceClient: DataServiceClient,
    ) { }

    async registerUser(username: string, email: string, password: string): Promise<void> {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = { username, email, password };

        try {
            await this.dataServiceClient.createUserInDataService(user);
            console.log(`User registered with email: ${email}`);
        } catch (error) {

            if (error.response && error.response.status === 400) {
                throw new BadRequestException(error.response.data.message || 'User registration failed: Invalid data');
            }
            console.error('Error registering user:', error);
            throw new BadRequestException('User registration failed');
        }
    }

    async login(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;

        console.log(`Attempting login for email: ${email}`);

        const user = await this.dataServiceClient.findUserByEmail(email); // Usando 'await' para garantir que seja resolvido

        console.log(`{ email: email, password: password }`, user);
        if (!user) {
            console.error(`User not found for email: ${email}`);
            throw new UnauthorizedException('Invalid credentials');
        }

        console.log("///", user.password, password);
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log(`Password validation result: ${isPasswordValid} `);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { email: user.email, sub: user.username };
        return {
            access_token: await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET })
        };
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.dataServiceClient.findUserByEmail(email); // Usando 'await'

        if (!user) {
            console.error(`User not found for email: ${email} `);
            return null;
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
