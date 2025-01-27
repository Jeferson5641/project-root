import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvConfig } from './modules/environment/env-variables';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar logs globais
  const logger = new Logger('Bootstrap');
  app.useLogger(logger);

  const envConfig = app.get(EnvConfig);
  const port = envConfig.port;
  await app.listen(port);
  console.log(`Gateway is running on http://localhost:${port}`);
}
bootstrap();
