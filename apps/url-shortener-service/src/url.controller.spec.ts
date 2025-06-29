/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
// apps/url-shortener-service/src/url.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from './entities/url.entity';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('UrlController', () => {
  let app: INestApplication;
  let urlService: UrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: UrlService,
          useValue: {
            shortenUrl: jest.fn(),
            findByShortCode: jest.fn(),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    urlService = module.get<UrlService>(UrlService);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(urlService).toBeDefined();
  });

  describe('POST /url/shorten', () => {
    const originalUrl = 'https://example.com/long/url';
    const shortCode = 'abcDEF';
    const mockUrl: Url = {
      id: 'some-uuid',
      originalUrl,
      shortCode,
      clicks: 0,
      userId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    it('should shorten a URL and return the short URL', async () => {
      jest.spyOn(urlService, 'shortenUrl').mockResolvedValue(mockUrl);

      const createUrlDto: CreateUrlDto = { originalUrl };

      const response = await request(app.getHttpServer())
        .post('/url/shorten')
        .send(createUrlDto)
        .expect(201); // HTTP 201 Created

      expect(urlService.shortenUrl).toHaveBeenCalledWith(
        originalUrl,
        undefined,
      ); // Sem userId por enquanto
      expect(response.body).toEqual({
        originalUrl: mockUrl.originalUrl,
        shortUrl: `http://localhost:3000/${mockUrl.shortCode}`, // Assumindo porta 3000
      } );
    });

    it('should return 400 if originalUrl is missing', async () => {
      const createUrlDto: CreateUrlDto = { originalUrl: '' }; // URL vazia

      await request(app.getHttpServer())
        .post('/url/shorten')
        .send(createUrlDto)
        .expect(400); // HTTP 400 Bad Request
    });

    it('should return 400 if originalUrl is not a valid URL format', async () => {
      const createUrlDto: CreateUrlDto = { originalUrl: 'not-a-valid-url' };

      await request(app.getHttpServer())
        .post('/url/shorten')
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
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    it('should redirect to the original URL and increment clicks', async () => {
      jest.spyOn(urlService, 'findByShortCode').mockResolvedValue(mockUrl);
      jest.spyOn(urlService, 'shortenUrl').mockResolvedValue(mockUrl); // Mock para evitar erro de dependência no teste

      const response = await request(app.getHttpServer())
        .get(`/${shortCode}`)
        .expect(302); // HTTP 302 Found (Redirecionamento)

      expect(urlService.findByShortCode).toHaveBeenCalledWith(shortCode);
      // O incremento de cliques será testado no serviço, aqui testamos o redirecionamento
      expect(response.header.location).toBe(originalUrl);
    });

    it('should return 404 if short code is not found', async () => {
      jest.spyOn(urlService, 'findByShortCode').mockResolvedValue(null);

      await request(app.getHttpServer()).get(`/${shortCode}`).expect(404); // HTTP 404 Not Found
    });
  });
});
