// apps/url-shortener-service/src/url.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { Url } from './entities/url.entity';
import { ShortCodeService } from './short-code.service';

@Module({
  imports: [TypeOrmModule.forFeature([Url])],
  controllers: [UrlController],
  providers: [UrlService, ShortCodeService],
  exports: [UrlService, ShortCodeService],
})
export class UrlModule {}
