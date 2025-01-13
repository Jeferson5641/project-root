import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { InMemoryDbService } from 'src/common/moks/in-memory-db.service';
import { HttpModule } from '@nestjs/axios';
import { JwtStrategy } from './jwt.strategy';
import { DataServiceClient } from './data-service.client';
import { EnvConfig } from 'src/config/env-variables';
import { ConfigModule } from '@nestjs/config';
import { EnvConfigModule } from 'src/config/env-config.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        EnvConfigModule,
        PassportModule,
        JwtModule.registerAsync({
            inject: [EnvConfig],
            useFactory: (envConfig: EnvConfig) => ({
                secret: envConfig.jwtSecret,
                signOptions: {
                    expiresIn: '1h',
                    algorithm: 'HS256',
                },
            }),
        }),
        HttpModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, InMemoryDbService, DataServiceClient],
})
export class AuthModule { }
