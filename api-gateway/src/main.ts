import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { EnvConfig } from './config/env-variables';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
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
  const logger = new Logger('Gateway');
  app.use((req, res, next) => {
    logger.log(`${req.method} ${req.url}`);
    next();
  });

  const envConfig = app.get(EnvConfig);
  const port = envConfig.port;

  logger.log(`Auth Service URL: ${envConfig.authServiceUrl}`);
  logger.log(`Data Service URL: ${envConfig.dataServiceUrl}`);

  await app.listen(port);
  console.log(`Gateway is running on http://localhost:${port}`);
  console.log(`Swagger is running on http://localhost:${port}/api-docs`);
}
bootstrap();
