import { NestFactory } from '@nestjs/core';
import { UrlShortenerServiceModule } from './url-shortener-service.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(UrlShortenerServiceModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 👇 Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('URL Shortener API')
    .setDescription('API para encurtamento de URLs com multi-tenancy')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}
void bootstrap();
