import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvConfig } from './modules/environment/env-variables';
import { Logger } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter
  );

  const config = new DocumentBuilder()
    .setTitle('Gateway and Proxy Services')
    .setDescription('The Gateway and Proxy API description of the routes')
    .setVersion('1.0')
    .addTag('Gateway')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Habilitar logs globais
  const logger = new Logger('Bootstrap');
  app.useLogger(logger);

  const envConfig = app.get(EnvConfig);
  const port = envConfig.port;

  await app.listen(port);
  console.log(`Gateway is running on http://localhost:${port}`);
  console.log(`Swagger is running on http://localhost:${port}/api-docs`);
}
bootstrap();
