import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlShortenerServiceController } from './url-shortener-service.controller';
import { UrlShortenerServiceService } from './url-shortener-service.service';
import { Url } from './entities/url.entity'; // CORRIGIDO: Caminho da entidade Url
import { UrlModule } from './url.module'; // CORRIGIDO: Caminho do UrlModule (está no mesmo nível)

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'url_shortener_db',
      entities: [Url],
      synchronize: true,
    }),
    UrlModule,
  ],
  controllers: [UrlShortenerServiceController],
  providers: [UrlShortenerServiceService],
})
export class UrlShortenerServiceModule {}
