/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// apps/url-shortener-service/src/url.service.spec.ts
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
  const MOCK_TENANT_ID = '00000000-0000-0000-0000-000000000001'; // O mesmo do serviço

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        ShortCodeService,
        {
          provide: getRepositoryToken(Url),
          useValue: {
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockImplementation((url: Url) => {
              const savedUrl: Url = {
                ...url,
                id: url.id || MOCK_URL_ID,
              } as Url;
              return Promise.resolve(savedUrl);
            }),
            findOneBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ClickEvent),
          useValue: {
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockImplementation((event: ClickEvent) => {
              const savedEvent: ClickEvent = {
                ...event,
                id: event.id || 'some-uuid-click',
              } as ClickEvent;
              return Promise.resolve(savedEvent);
            }),
          },
        },
        {
          provide: getRepositoryToken(Tenant),
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

    // Garanta que ensureDefaultTenantExists seja chamado e mockado
    jest
      .spyOn(service as any, 'ensureDefaultTenantExists')
      .mockResolvedValue(undefined);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('shortenUrl', () => {
    it('should create and save a new short URL with default tenantId if not provided', async () => {
      jest
        .spyOn(shortCodeService, 'generateShortCode')
        .mockReturnValue(MOCK_SHORT_CODE);

      const result = await service.shortenUrl(MOCK_ORIGINAL_URL);

      expect(service['ensureDefaultTenantExists']).toHaveBeenCalled(); // Verifica se o método auxiliar foi chamado
      expect(urlRepository.create).toHaveBeenCalledWith({
        originalUrl: MOCK_ORIGINAL_URL,
        shortCode: MOCK_SHORT_CODE,
        clicks: 0,
        userId: undefined,
        tenantId: MOCK_TENANT_ID, // Verifica se o tenantId padrão foi atribuído
      });
      expect(urlRepository.save).toHaveBeenCalled();
      expect(result).toEqual(
        expect.objectContaining({
          originalUrl: MOCK_ORIGINAL_URL,
          shortCode: MOCK_SHORT_CODE,
          tenantId: MOCK_TENANT_ID,
        }),
      );
    });

    it('should create and save a new short URL with provided tenantId', async () => {
      const customTenantId = '00000000-0000-0000-0000-000000000002';
      jest
        .spyOn(shortCodeService, 'generateShortCode')
        .mockReturnValue(MOCK_SHORT_CODE);

      const result = await service.shortenUrl(
        MOCK_ORIGINAL_URL,
        undefined,
        customTenantId,
      );

      expect(service['ensureDefaultTenantExists']).toHaveBeenCalled();
      expect(urlRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          tenantId: customTenantId, // Verifica se o tenantId personalizado foi atribuído
        }),
      );
      expect(result).toEqual(
        expect.objectContaining({
          tenantId: customTenantId,
        }),
      );
    });

    it('should retry generating short code if a collision occurs within the same tenant', async () => {
      jest
        .spyOn(shortCodeService, 'generateShortCode')
        .mockReturnValueOnce(MOCK_SHORT_CODE)
        .mockReturnValueOnce('anotherCode');

      // Simula colisão para o mesmo tenantId
      jest
        .spyOn(urlRepository, 'findOneBy')
        .mockResolvedValueOnce(new Url()) // Colisão
        .mockResolvedValueOnce(null); // Sucesso

      const result = await service.shortenUrl(MOCK_ORIGINAL_URL);

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
        expect.objectContaining({
          shortCode: 'anotherCode',
          tenantId: MOCK_TENANT_ID,
        }),
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

  describe('findByShortCode', () => {
    const MOCK_URL_WITH_TENANT: Url = {
      id: MOCK_URL_ID,
      originalUrl: MOCK_ORIGINAL_URL,
      shortCode: MOCK_SHORT_CODE,
      clicks: 5,
      userId: null,
      tenantId: MOCK_TENANT_ID, // URL com tenantId
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      clickEvents: [],
      tenant: null, // Mock para a relação
    };

    it('should find a URL by short code and tenantId, increment clicks, and record a click event', async () => {
      jest
        .spyOn(urlRepository, 'findOneBy')
        .mockResolvedValue(MOCK_URL_WITH_TENANT);
      jest
        .spyOn(urlRepository, 'save')
        .mockImplementation((url) => Promise.resolve(url));
      jest
        .spyOn(clickEventRepository, 'save')
        .mockImplementation((event) => Promise.resolve(event)); // Mock para save do clickEvent

      const ipAddress = '192.168.1.1';
      const userAgent = 'Mozilla/5.0 (Test)';

      const result = await service.findByShortCode(
        MOCK_SHORT_CODE,
        ipAddress,
        userAgent,
        MOCK_TENANT_ID,
      );

      expect(urlRepository.findOneBy).toHaveBeenCalledWith({
        shortCode: MOCK_SHORT_CODE,
        tenantId: MOCK_TENANT_ID,
        deletedAt: null,
      });
      expect(result).toBeDefined();
      expect(result!.clicks).toBe(6);

      expect(urlRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: MOCK_URL_ID,
          clicks: 6,
        }),
      );

      // Verifique a criação e salvamento do ClickEvent
      expect(clickEventRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          url: MOCK_URL_WITH_TENANT, // Passa a instância da URL
          tenantId: MOCK_TENANT_ID,
          ipAddress: ipAddress,
          userAgent: userAgent,
        }),
      );
      expect(clickEventRepository.save).toHaveBeenCalled();
    });

    it('should return null if URL is not found for the given short code and tenantId', async () => {
      jest.spyOn(urlRepository, 'findOneBy').mockResolvedValue(null);

      const result = await service.findByShortCode(
        MOCK_SHORT_CODE,
        undefined,
        undefined,
        MOCK_TENANT_ID,
      );

      expect(urlRepository.findOneBy).toHaveBeenCalledWith({
        shortCode: MOCK_SHORT_CODE,
        tenantId: MOCK_TENANT_ID,
        deletedAt: null,
      });
      expect(result).toBeNull();
      expect(urlRepository.save).not.toHaveBeenCalled();
      expect(clickEventRepository.create).not.toHaveBeenCalled();
      expect(clickEventRepository.save).not.toHaveBeenCalled();
    });
  });
});
