import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { EnvConfig } from './config/env-variables';
import { GatewayController } from './modules/gateway/gateway.controller';
import { GatewayService } from './modules/gateway/gateway.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [GatewayController],
  providers: [AppService, EnvConfig, GatewayService],
  exports: [EnvConfig],
})
export class AppModule { }
