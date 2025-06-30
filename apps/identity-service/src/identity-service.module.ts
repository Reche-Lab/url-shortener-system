import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdentityServiceController } from './identity-service.controller';
import { IdentityServiceService } from './identity-service.service';
import { User } from './entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME || 'user',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'url_shortener_db',
      entities: [User],
      synchronize: process.env.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [IdentityServiceController],
  providers: [IdentityServiceService],
})
export class IdentityServiceModule {}
