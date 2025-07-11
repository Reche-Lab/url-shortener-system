import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Response } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('URLs')
@Controller()
export class UrlController {
  private readonly DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

  constructor(private readonly urlService: UrlService) {}

  @Post('api/shorten')
  @ApiOperation({ summary: 'Cria uma URL encurtada' })
  async shorten(@Body() createUrlDto: CreateUrlDto) {
    const userId = undefined;
    const tenantId = this.DEFAULT_TENANT_ID;

    const newUrl = await this.urlService.shortenUrl(
      createUrlDto.originalUrl,
      userId,
      tenantId,
    );
    return {
      originalUrl: newUrl.originalUrl,
      shortUrl: `http://localhost:3001/${newUrl.shortCode}`,
    };
  }

  @Get(':shortCode')
  @ApiOperation({ summary: 'Redireciona para a URL original' })
  async redirectToOriginalUrl(
    @Param('shortCode') shortCode: string,
    @Res() res: Response,
  ) {
    const tenantId = this.DEFAULT_TENANT_ID;

    const ipAddress = res.req.ip;
    const userAgent = res.req.headers['user-agent'];

    const url = await this.urlService.findByShortCode(
      shortCode,
      ipAddress,
      userAgent,
      tenantId,
    );

    if (!url) {
      throw new NotFoundException('URL not found or expired.');
    }

    res.redirect(HttpStatus.FOUND, url.originalUrl);
  }
}
