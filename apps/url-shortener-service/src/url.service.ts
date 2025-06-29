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
    const MAX_RETRIES = 5;

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
    }

    throw new Error(
      'Failed to generate a unique short code after multiple retries.',
    );
  }

  async findByShortCode(shortCode: string): Promise<Url | null> {
    return this.urlsRepository.findOneBy({ shortCode, deletedAt: IsNull() });
  }
}
