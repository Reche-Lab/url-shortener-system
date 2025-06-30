import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { IdentityServiceModule } from './identity-service.module';

async function bootstrap() {
  const app = await NestFactory.create(IdentityServiceModule);
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS para comunicação entre serviços
  app.enableCors();

  const port = process.env.IDENTITY_SERVICE_PORT || 3002;
  await app.listen(port);

  console.log(`Identity Service running on port ${port}`);
}
void bootstrap();
