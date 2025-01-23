import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GatewayModule } from './modules/gateway/gateway.module';
import { GatewayController } from './modules/gateway/gateway.controller';
import { EnvConfigModule } from './modules/environment/env-config.module';

@Module({
  imports: [GatewayModule, EnvConfigModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule { }
