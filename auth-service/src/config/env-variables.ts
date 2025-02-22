import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvConfig {
    constructor(private configService: ConfigService) { }

    get port(): number {
        return this.configService.get<number>('PORT');
    }

    get jwtSecret(): string {
        return this.configService.get<string>('JWT_SECRET');
    }

    get dataServiceUrl(): string {
        return this.configService.get<string>('DATA_SERVICE_URL');
    }
}