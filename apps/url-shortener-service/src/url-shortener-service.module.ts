import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlShortenerServiceController } from './url-shortener-service.controller';
import { UrlShortenerServiceService } from './url-shortener-service.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'url_shortener_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [UrlShortenerServiceController],
  providers: [UrlShortenerServiceService],
})
export class UrlShortenerServiceModule {}
