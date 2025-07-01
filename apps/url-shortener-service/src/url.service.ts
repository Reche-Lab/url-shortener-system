import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, DeepPartial } from 'typeorm';
import { Url } from './entities/url.entity';
import { ShortCodeService } from './short-code.service';
import { ClickEvent } from './entities/click-event.entity';
import { Tenant } from './entities/tenant.entity';

@Injectable()
export class UrlService {
  private readonly DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

  constructor(
    @InjectRepository(Url)
    private urlsRepository: Repository<Url>,
    @InjectRepository(ClickEvent)
    private clickEventsRepository: Repository<ClickEvent>,
    @InjectRepository(Tenant)
    private tenantsRepository: Repository<Tenant>,
    private shortCodeService: ShortCodeService,
  ) {}

  async shortenUrl(
    originalUrl: string,
    userId?: string,
    tenantId?: string,
  ): Promise<Url> {
    let shortCode: string;
    let existingUrl: Url | null;
    const MAX_RETRIES = 5;

    // Use o tenantId fornecido ou o padrão
    const finalTenantId = tenantId || this.DEFAULT_TENANT_ID;

    // Garanta que o tenant padrão exista (para desenvolvimento inicial)
    await this.ensureDefaultTenantExists();

    for (let i = 0; i < MAX_RETRIES; i++) {
      shortCode = this.shortCodeService.generateShortCode();
      existingUrl = await this.urlsRepository.findOneBy({
        shortCode,
        tenantId: finalTenantId,
      });

      if (!existingUrl) {
        const newUrl = this.urlsRepository.create({
          originalUrl,
          shortCode,
          clicks: 0,
          userId,
          tenantId: finalTenantId, // Atribua o tenantId
        });
        return this.urlsRepository.save(newUrl);
      }
    }
    throw new Error(
      'Failed to generate a unique short code after multiple retries.',
    );
  }

  async findByShortCode(
    shortCode: string,
    ipAddress?: string,
    userAgent?: string,
    tenantId?: string,
  ): Promise<Url | null> {
    // Use o tenantId fornecido ou o padrão para buscar a URL
    const finalTenantId = tenantId || this.DEFAULT_TENANT_ID;

    const url = await this.urlsRepository.findOneBy({
      shortCode,
      tenantId: finalTenantId,
      deletedAt: IsNull(),
    });

    if (url) {
      url.clicks++;
      await this.urlsRepository.save(url);

      const clickEvent: DeepPartial<ClickEvent> = {
        url: url,
        ipAddress: ipAddress || undefined,
        userAgent: userAgent || undefined,
      };

      await this.clickEventsRepository.save(
        this.clickEventsRepository.create(clickEvent),
      );
    }

    return url;
  }

  private async ensureDefaultTenantExists(): Promise<void> {
    let defaultTenant = await this.tenantsRepository.findOneBy({
      id: this.DEFAULT_TENANT_ID,
    });
    if (!defaultTenant) {
      defaultTenant = this.tenantsRepository.create({
        id: this.DEFAULT_TENANT_ID,
        name: 'Default Public Tenant',
      });
      await this.tenantsRepository.save(defaultTenant);
      console.log(`Default tenant created with ID: ${this.DEFAULT_TENANT_ID}`);
    }
  }
}
