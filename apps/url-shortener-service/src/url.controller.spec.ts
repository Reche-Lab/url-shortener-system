import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from './entities/url.entity';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

describe('UrlController', () => {
  let app: INestApplication;
  let urlService: UrlService;

  const mockUrlService = {
    shortenUrl: jest.fn(),
    findByShortCode: jest.fn(),
  };

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

  describe('POST /shorten', () => {
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
      mockUrlService.shortenUrl.mockResolvedValue(mockUrl);

      const createUrlDto: CreateUrlDto = { originalUrl };

      const response = await request(app.getHttpServer())
        .post('/shorten')
        .send(createUrlDto)
        .expect(201); // HTTP 201 Created

      expect(mockUrlService.shortenUrl).toHaveBeenCalledWith(originalUrl);

      expect(response.body).toEqual({
        originalUrl: mockUrl.originalUrl,
        shortUrl: `http://localhost:3000/${mockUrl.shortCode}`,
      });
    });

    it('should return 400 if originalUrl is missing', async () => {
      const createUrlDto: CreateUrlDto = { originalUrl: '' }; // URL vazia

      await request(app.getHttpServer())
        .post('/shorten')
        .send(createUrlDto)
        .expect(400); // HTTP 400 Bad Request
    });

    it('should return 400 if originalUrl is not a valid URL format', async () => {
      const createUrlDto: CreateUrlDto = { originalUrl: 'not-a-valid-url' };

      await request(app.getHttpServer())
        .post('/shorten')
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
      mockUrlService.findByShortCode.mockResolvedValue(mockUrl);

      const response = await request(app.getHttpServer())
        .get(`/${shortCode}`)
        .expect(302); // HTTP 302 Found (Redirecionamento)

      expect(mockUrlService.findByShortCode).toHaveBeenCalledWith(shortCode);
      expect(response.header.location).toBe(originalUrl);
    });

    it('should return 404 if short code is not found', async () => {
      mockUrlService.findByShortCode.mockResolvedValue(null);

      await request(app.getHttpServer()).get(`/${shortCode}`).expect(404); // HTTP 404 Not Found
    });
  });
});
