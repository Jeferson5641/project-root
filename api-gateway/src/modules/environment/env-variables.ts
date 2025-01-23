import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EnvConfig {
    constructor(private readonly configService: ConfigService) {
        this.validateEnvVariables();
    }

    private validateEnvVariables(): void {
        const requiredVariables = ['DATA_SERVICE_URL', 'AUTH_SERVICES_URL'];

        requiredVariables.forEach(variable => {
            if (!process.env[variable]) {
                throw new Error(
                    `Critical ERROR: ${variable} is not defined. Please set the ${variable} environment variable`
                );
            }
        })
    }

    get dataServiceUrl(): string {
        return this.configService.get('DATA_SERVICE_URL');
    }

    get authServiceUrl(): string {
        return this.configService.get('AUTH_SERVICES_URL');
    }

    get port(): string {
        return this.configService.get('PORT');
    }
}