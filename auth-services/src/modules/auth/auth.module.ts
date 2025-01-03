import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from '../../config/app.config';
import { InMemoryDbService } from 'src/common/moks/in-memory-db.service';
import { HttpModule } from '@nestjs/axios';
import { JwtStrategy } from './jwt.strategy';
import { DataServiceClient } from './data-service.client';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {
                expiresIn: '1h',
                algorithm: 'HS256',
            },
        }),
        HttpModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, InMemoryDbService, DataServiceClient],
})
export class AuthModule { }
