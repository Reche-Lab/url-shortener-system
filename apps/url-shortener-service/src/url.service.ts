import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Url } from './entities/url.entity';
import { ShortCodeService } from './short-code.service';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private urlsRepository: Repository<Url>,
    private shortCodeService: ShortCodeService,
  ) {}

  async shortenUrl(originalUrl: string, userId?: string): Promise<Url> {
    let shortCode: string;
    let existingUrl: Url | null;
    const MAX_RETRIES = 5; // Limite de tentativas para evitar loop infinito em caso de muitas colisões

    for (let i = 0; i < MAX_RETRIES; i++) {
      shortCode = this.shortCodeService.generateShortCode();
      existingUrl = await this.urlsRepository.findOneBy({ shortCode });

      if (!existingUrl) {
        const newUrl = this.urlsRepository.create({
          originalUrl,
          shortCode,
          clicks: 0,
          userId,
        });
        return this.urlsRepository.save(newUrl);
      }
      // Se houver colisão, o loop continua para gerar um novo código
    }

    // Se atingir o limite de retries, pode lançar um erro ou ter uma estratégia de fallback
    throw new Error(
      'Failed to generate a unique short code after multiple retries.',
    );
  }

  async findByShortCode(shortCode: string): Promise<Url | null> {
    // Garante que apenas URLs não deletadas logicamente sejam retornadas
    return this.urlsRepository.findOneBy({ shortCode, deletedAt: IsNull() });
  }

  // Outros métodos CRUD serão implementados depois
}
