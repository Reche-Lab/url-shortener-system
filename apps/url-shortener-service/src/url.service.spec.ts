/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { Repository } from 'typeorm';
import { ShortCodeService } from './short-code.service';
import { ClickEvent } from './entities/click-event.entity';
import { Tenant } from './entities/tenant.entity';

describe('UrlService', () => {
  let service: UrlService;
  let urlRepository: Repository<Url>;
  let clickEventRepository: Repository<ClickEvent>;
  let tenantRepository: Repository<Tenant>;
  let shortCodeService: ShortCodeService;

  const MOCK_SHORT_CODE = 'aBcDeF';
  const MOCK_ORIGINAL_URL = 'https://example.com/very/long/url';
  const MOCK_URL_ID = 'some-uuid-url';
  const MOCK_TENANT_ID = '00000000-0000-0000-0000-000000000001';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        ShortCodeService,
        {
          provide: getRepositoryToken(Url),
          useValue: {
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest
              .fn()
              .mockImplementation((url) =>
                Promise.resolve({ id: MOCK_URL_ID, ...url }),
              ),
            findOneBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ClickEvent), // CORRIGIDO: Usar getRepositoryToken
          useValue: {
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest
              .fn()
              .mockImplementation((event) =>
                Promise.resolve({ id: 'some-uuid-click', ...event }),
              ),
          },
        },
        {
          provide: getRepositoryToken(Tenant), // CORRIGIDO: Usar getRepositoryToken
          useValue: {
            findOneBy: jest.fn().mockResolvedValue({
              id: MOCK_TENANT_ID,
              name: 'Default Public Tenant',
            }),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest
              .fn()
              .mockImplementation((tenant) => Promise.resolve(tenant)),
          },
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
    urlRepository = module.get<Repository<Url>>(getRepositoryToken(Url));
    clickEventRepository = module.get<Repository<ClickEvent>>(
      getRepositoryToken(ClickEvent),
    );
    tenantRepository = module.get<Repository<Tenant>>(
      getRepositoryToken(Tenant),
    );
    shortCodeService = module.get<ShortCodeService>(ShortCodeService);

    jest
      .spyOn(service as any, 'ensureDefaultTenantExists')
      .mockResolvedValue(undefined);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('shortenUrl', () => {
    it('should create and save a new short URL', async () => {
      jest
        .spyOn(shortCodeService, 'generateShortCode')
        .mockReturnValue(MOCK_SHORT_CODE);

      const result = await service.shortenUrl(MOCK_ORIGINAL_URL);

      expect(shortCodeService.generateShortCode).toHaveBeenCalled();
      expect(urlRepository.create).toHaveBeenCalledWith({
        originalUrl: MOCK_ORIGINAL_URL,
        shortCode: MOCK_SHORT_CODE,
        clicks: 0,
        userId: undefined,
        tenantId: MOCK_TENANT_ID,
      });
      expect(urlRepository.save).toHaveBeenCalled();
      expect(result).toEqual(
        expect.objectContaining({
          originalUrl: MOCK_ORIGINAL_URL,
          shortCode: MOCK_SHORT_CODE,
        }),
      );
    });

    it('should retry generating short code if a collision occurs', async () => {
      jest
        .spyOn(shortCodeService, 'generateShortCode')
        .mockReturnValueOnce(MOCK_SHORT_CODE) // Primeira tentativa: colisão
        .mockReturnValueOnce('anotherCode'); // Segunda tentativa: sucesso

      jest
        .spyOn(urlRepository, 'findOneBy')
        .mockResolvedValueOnce(new Url()) // Simula que o primeiro código já existe
        .mockResolvedValueOnce(null); // Simula que o segundo código não existe

      const result = await service.shortenUrl(MOCK_ORIGINAL_URL);

      expect(shortCodeService.generateShortCode).toHaveBeenCalledTimes(2);
      expect(urlRepository.findOneBy).toHaveBeenCalledWith({
        shortCode: MOCK_SHORT_CODE,
        tenantId: MOCK_TENANT_ID,
      });
      expect(urlRepository.findOneBy).toHaveBeenCalledWith({
        shortCode: 'anotherCode',
        tenantId: MOCK_TENANT_ID,
      });
      expect(urlRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ shortCode: 'anotherCode' }),
      );
      expect(result).toEqual(
        expect.objectContaining({ shortCode: 'anotherCode' }),
      );
    });

    it('should associate the URL with a userId if provided', async () => {
      const userId = 'user-123';
      jest
        .spyOn(shortCodeService, 'generateShortCode')
        .mockReturnValue(MOCK_SHORT_CODE);

      const result = await service.shortenUrl(MOCK_ORIGINAL_URL, userId);

      expect(urlRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: userId,
        }),
      );
      expect(result).toEqual(
        expect.objectContaining({
          userId: userId,
        }),
      );
    });
  });
});
