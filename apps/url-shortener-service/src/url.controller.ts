// apps/url-shortener-service/src/url.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Response } from 'express';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  @HttpCode(HttpStatus.CREATED) // Retorna 201 Created
  async shorten(@Body() createUrlDto: CreateUrlDto) {
    // Por enquanto, userId é undefined. Será adicionado com a feature de autenticação.
    const newUrl = await this.urlService.shortenUrl(createUrlDto.originalUrl);
    // Retorna a URL encurtada completa, incluindo o domínio da aplicação
    // Em um ambiente real, 'http://localhost:3000' seria uma variável de ambiente
    return {
      originalUrl: newUrl.originalUrl,
      shortUrl: `http://localhost:3000/${newUrl.shortCode}`,
    };
  }

  // Endpoint para redirecionamento e contabilização de cliques
  @Get(':shortCode')
  async redirectToOriginalUrl(
    @Param('shortCode') shortCode: string,
    @Res() res: Response,
  ) {
    const url = await this.urlService.findByShortCode(shortCode);

    if (!url) {
      throw new NotFoundException('Short URL not found or has been deleted.');
    }

    // TODO: Implementar o incremento de cliques no serviço (será feito no próximo passo de contabilização)
    // Por enquanto, apenas redireciona
    res.redirect(HttpStatus.FOUND, url.originalUrl); // HTTP 302 Found
  }
}
