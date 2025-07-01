import { NestFactory } from '@nestjs/core';
import { UrlShortenerServiceModule } from './url-shortener-service.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UrlController } from './url.controller';

async function bootstrap() {
  const app = await NestFactory.create(UrlShortenerServiceModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('URL Shortener API')
    .setDescription('API para encurtamento de URLs com multi-tenancy')
    .setVersion('1.0')
    .build();

  console.log('UrlController:', app.get(UrlController));
  const document = SwaggerModule.createDocument(app, config);

  // Altere o path do Swagger para '/api/docs' para evitar conflito com shortCodes
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3001);
  console.log(`🚀 URL Shortener Service running at http://localhost:3001`);
  console.log(`📄 Swagger docs at http://localhost:3001/api/docs`);
}
void bootstrap();
