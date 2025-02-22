import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvConfig {
    constructor(private configService: ConfigService) { }

    get port(): number {
        return this.configService.get<number>('PORT');
    }

    get authServiceUrl(): string {
        return this.configService.get<string>('AUTH_SERVICE_URL');
    }

    get dataServiceUrl(): string {
        return this.configService.get<string>('DATA_SERVICE_URL');
    }
    get authServiceUrl2(): string {
        return this.configService.get<string>('AUTH_SERVICE_URL2');
    }

    get dataServiceUrl2(): string {
        return this.configService.get<string>('DATA_SERVICE_URL2');
    }
}
