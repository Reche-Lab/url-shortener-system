import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { IdentityServiceModule } from './identity-service.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(IdentityServiceModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Identity Service API')
    .setDescription('Endpoints para autenticação e usuários')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.IDENTITY_SERVICE_PORT || 3002;
  await app.listen(port);

  console.log(`Identity Service running on port ${port}`);
  console.log(`Swagger docs at http://localhost:${port}/api/docs`);
}
void bootstrap();
