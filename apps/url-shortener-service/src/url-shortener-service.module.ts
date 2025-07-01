import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlShortenerServiceController } from './url-shortener-service.controller';
import { UrlShortenerServiceService } from './url-shortener-service.service';
import { UrlModule } from './url.module';
import { Url } from './entities/url.entity';
import { ClickEvent } from './entities/click-event.entity';
import { Tenant } from './entities/tenant.entity';
import { TenantModule } from './tenant.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'user',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'url_shortener_db',
      entities: [Url, ClickEvent, Tenant],
      synchronize: process.env.NODE_ENV === 'development',
    }),
    UrlModule,
    TenantModule,
  ],
  controllers: [UrlShortenerServiceController],
  providers: [UrlShortenerServiceService],
})
export class UrlShortenerServiceModule {}
