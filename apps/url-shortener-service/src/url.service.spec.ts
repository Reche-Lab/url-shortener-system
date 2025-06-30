/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { Repository, IsNull } from 'typeorm';
import { ShortCodeService } from './short-code.service';
import { ClickEvent } from './entities/click-event.entity';
import { Tenant } from './entities/tenant.entity';

// Função auxiliar para criar mocks de save mais robustos
const createMockRepositorySave = <T extends { id: string }>(mockId: string) => {
  return jest.fn().mockImplementation((entity: T) => {
    const savedEntity: T = { ...entity, id: entity.id || mockId };
    return Promise.resolve(savedEntity);
  });
};

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

  // Defina os mocks aqui para que sejam acessíveis e redefiníveis
  const mockUrlRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: createMockRepositorySave<Url>(MOCK_URL_ID),
    findOneBy: jest.fn(),
  };

  const mockClickEventRepository = {
    create: jest.fn().mockImplementation((dto) => dto), // Mantenha esta linha
    save: createMockRepositorySave<ClickEvent>('some-uuid-click'),
  };

  const mockTenantRepository = {
    findOneBy: jest
      .fn()
      .mockResolvedValue({ id: MOCK_TENANT_ID, name: 'Default Public Tenant' }),
    create: jest.fn().mockImplementation((dto) => dto),
    save: createMockRepositorySave<Tenant>('some-uuid-tenant'),
  };

  beforeEach(async () => {
    jest.clearAllMocks(); // Limpa todos os mocks antes de cada teste

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        ShortCodeService,
        {
          provide: getRepositoryToken(Url),
          useValue: mockUrlRepository,
        },
        {
          provide: getRepositoryToken(ClickEvent),
          useValue: mockClickEventRepository,
        },
        {
          provide: getRepositoryToken(Tenant),
          useValue: mockTenantRepository,
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

    jest.spyOn(clickEventRepository, 'create').mockImplementation(
      (dto) =>
        ({
          id: 'mock-click-id',
          clickedAt: new Date(),
          ...dto,
        }) as ClickEvent,
    );
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

      expect(service['ensureDefaultTenantExists']).toHaveBeenCalled();
      expect(mockUrlRepository.create).toHaveBeenCalledWith({
        originalUrl: MOCK_ORIGINAL_URL,
        shortCode: MOCK_SHORT_CODE,
        clicks: 0,
        userId: undefined,
        tenantId: MOCK_TENANT_ID,
      });
      expect(mockUrlRepository.save).toHaveBeenCalled();
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
      expect(mockUrlRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          tenantId: customTenantId,
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

      jest
        .spyOn(mockUrlRepository, 'findOneBy')
        .mockResolvedValueOnce(new Url())
        .mockResolvedValueOnce(null);

      const result = await service.shortenUrl(MOCK_ORIGINAL_URL);

      expect(mockUrlRepository.findOneBy).toHaveBeenCalledWith({
        shortCode: MOCK_SHORT_CODE,
        tenantId: MOCK_TENANT_ID,
      });
      expect(mockUrlRepository.findOneBy).toHaveBeenCalledWith({
        shortCode: 'anotherCode',
        tenantId: MOCK_TENANT_ID,
      });
      expect(mockUrlRepository.save).toHaveBeenCalledWith(
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

      expect(mockUrlRepository.create).toHaveBeenCalledWith(
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
      tenantId: MOCK_TENANT_ID,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      clickEvents: [],
      tenant: null,
    };

    it('should find a URL by short code and tenantId, increment clicks, and record a click event', async () => {
      jest
        .spyOn(mockUrlRepository, 'findOneBy')
        .mockResolvedValue(MOCK_URL_WITH_TENANT);

      const ipAddress = '192.168.1.1';
      const userAgent = 'Mozilla/5.0 (Test)';

      const result = await service.findByShortCode(
        MOCK_SHORT_CODE,
        ipAddress,
        userAgent,
        MOCK_TENANT_ID,
      );

      expect(mockUrlRepository.findOneBy).toHaveBeenCalledWith({
        shortCode: MOCK_SHORT_CODE,
        tenantId: MOCK_TENANT_ID,
        deletedAt: IsNull(),
      });
      expect(result).toBeDefined();
      expect(result!.clicks).toBe(6);

      expect(mockUrlRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: MOCK_URL_ID,
          clicks: 6,
        }),
      );

      // AQUI ESTÁ A MUDANÇA CRÍTICA: Use o mockClickEventRepository diretamente
      expect(mockClickEventRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          url: MOCK_URL_WITH_TENANT,
          tenantId: MOCK_TENANT_ID,
          ipAddress: ipAddress,
          userAgent: userAgent,
        }),
      );
      expect(mockClickEventRepository.save).toHaveBeenCalled();
    });

    it('should return null if URL is not found for the given short code and tenantId', async () => {
      jest.spyOn(mockUrlRepository, 'findOneBy').mockResolvedValue(null);

      const result = await service.findByShortCode(
        MOCK_SHORT_CODE,
        undefined,
        undefined,
        MOCK_TENANT_ID,
      );

      expect(mockUrlRepository.findOneBy).toHaveBeenCalledWith({
        shortCode: MOCK_SHORT_CODE,
        tenantId: MOCK_TENANT_ID,
        deletedAt: IsNull(),
      });
      expect(result).toBeNull();
      expect(mockUrlRepository.save).not.toHaveBeenCalled();
      expect(mockClickEventRepository.create).not.toHaveBeenCalled();
      expect(mockClickEventRepository.save).not.toHaveBeenCalled();
    });
  });
});
