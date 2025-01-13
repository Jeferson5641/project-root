import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvConfig {
    constructor(
        private readonly configService: ConfigService
    ) {
        this.validateEnvVariables();
    }

    private validateEnvVariables(): void {
        const requiredVariables = ['DATA_SERVICE_URL', 'PORT', 'JWT_SECRET', 'NODE_ENV'];

        requiredVariables.forEach(variable => {
            if (!process.env[variable]) {
                throw new Error(
                    `Critical ERROR: ${variable} is not defined. Please set the ${variable} environment variable`
                );
            }
        });
    }

    get dataServiceUrl(): string {
        return this.configService.get('DATA_SERVICE_URL');
    }
    get port(): string {
        return this.configService.get('PORT');
    }
    get jwtSecret(): string {
        return this.configService.get('JWT_SECRET');
    }
    get nodeEnv(): string {
        return this.configService.get('NODE_ENV');
    }
}