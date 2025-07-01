import { NestFactory } from '@nestjs/core';
import { UrlShortenerServiceModule } from './url-shortener-service.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(UrlShortenerServiceModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades que não estão no DTO
      forbidNonWhitelisted: true, // Lança erro se houver propriedades não permitidas
      transform: true, // Transforma payloads em instâncias do DTO
    }),
  );
  await app.listen(3001);
}
void bootstrap();
