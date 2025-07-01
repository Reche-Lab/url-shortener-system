import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { Url } from './entities/url.entity';
import { ClickEvent } from './entities/click-event.entity';
import { Tenant } from './entities/tenant.entity';
import { ShortCodeService } from './short-code.service';

@Module({
  imports: [TypeOrmModule.forFeature([Url, ClickEvent, Tenant])],
  controllers: [UrlController],
  providers: [UrlService, ShortCodeService],
  exports: [UrlService, ShortCodeService],
})
export class UrlModule {}
