/* eslint-disable @typescript-eslint/no-unsafe-argument */
// apps/url-shortener-service/src/url.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from './entities/url.entity';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Tenant } from './entities/tenant.entity';

describe('UrlController', () => {
  let app: INestApplication;
  let urlService: UrlService;

  const mockUrlService = {
    shortenUrl: jest.fn(),
    findByShortCode: jest.fn(),
  };

  const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: UrlService,
          useValue: mockUrlService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    urlService = module.get<UrlService>(UrlService);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(urlService).toBeDefined();
  });

  describe('POST /api/shorten', () => {
    const originalUrl = 'https://example.com/long/url';
    const shortCode = 'abcDEF';
    const mockUrl: Url = {
      id: 'some-uuid',
      originalUrl,
      shortCode,
      clicks: 0,
      userId: null,
      tenantId: DEFAULT_TENANT_ID,
      tenant: null as unknown as Tenant,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      clickEvents: [],
    };

    it('should shorten a URL and return the short URL', async () => {
      mockUrlService.shortenUrl.mockResolvedValue(mockUrl);

      const createUrlDto: CreateUrlDto = { originalUrl };

      const response = await request(app.getHttpServer())
        .post('/api/shorten')
        .send(createUrlDto)
        .expect(201);

      // CORRIGIDO: Adicionado undefined para userId e DEFAULT_TENANT_ID para tenantId
      expect(mockUrlService.shortenUrl).toHaveBeenCalledWith(
        originalUrl,
        undefined, // userId
        DEFAULT_TENANT_ID, // tenantId
      );

      expect(response.body).toEqual({
        originalUrl: mockUrl.originalUrl,
        shortUrl: `http://localhost:3001/${mockUrl.shortCode}`,
      });
    });

    it('should return 400 if originalUrl is missing', async () => {
      const createUrlDto: CreateUrlDto = { originalUrl: '' };

      await request(app.getHttpServer())
        .post('/api/shorten')
        .send(createUrlDto)
        .expect(400);
    });

    it('should return 400 if originalUrl is not a valid URL format', async () => {
      const createUrlDto: CreateUrlDto = { originalUrl: 'not-a-valid-url' };

      await request(app.getHttpServer())
        .post('/api/shorten')
        .send(createUrlDto)
        .expect(400);
    });
  });

  describe('GET /:shortCode', () => {
    const shortCode = 'abcDEF';
    const originalUrl = 'https://example.com/redirect';
    const mockUrl: Url = {
      id: 'some-uuid',
      originalUrl,
      shortCode,
      clicks: 0,
      userId: null,
      tenantId: DEFAULT_TENANT_ID,
      tenant: null as unknown as Tenant, // Explicitamente tipado como Tenant ou null
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      clickEvents: [],
    };

    it('should redirect to the original URL and increment clicks', async () => {
      mockUrlService.findByShortCode.mockResolvedValue(mockUrl);

      const ipAddress = '::ffff:127.0.0.1'; // IP local para testes
      const userAgent = 'supertest';

      const response = await request(app.getHttpServer())
        .get(`/${shortCode}`)
        .set('User-Agent', userAgent)
        .expect(302);

      expect(mockUrlService.findByShortCode).toHaveBeenCalledWith(
        shortCode,
        ipAddress,
        userAgent,
        DEFAULT_TENANT_ID, // tenantId
      );
      expect(response.header.location).toBe(originalUrl);
    });

    it('should return 404 if short code is not found', async () => {
      mockUrlService.findByShortCode.mockResolvedValue(null);

      await request(app.getHttpServer()).get(`/${shortCode}`).expect(404);
    });
  });
});
