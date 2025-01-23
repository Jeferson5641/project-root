import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvConfig } from './modules/environment/env-variables';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const envConfig = app.get(EnvConfig);
  const port = envConfig.port;
  await app.listen(port);
  console.log(`Gateway is running on http://localhost:${port}`);
}
bootstrap();
