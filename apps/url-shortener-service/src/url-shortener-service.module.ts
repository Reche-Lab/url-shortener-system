import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlShortenerServiceController } from './url-shortener-service.controller';
import { UrlShortenerServiceService } from './url-shortener-service.service';
import { Url } from './entities/url.entity';
import { UrlModule } from './url.module';
import { Tenant } from './entities/tenant.entity';
import { TenantModule } from './tenant.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'url_shortener_db',
      entities: [Url, Tenant],
      synchronize: true,
    }),
    UrlModule,
    TenantModule,
  ],
  controllers: [UrlShortenerServiceController],
  providers: [UrlShortenerServiceService],
})
export class UrlShortenerServiceModule {}
