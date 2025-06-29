/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { Repository } from 'typeorm';
import { ShortCodeService } from './short-code.service';

describe('UrlService', () => {
  let service: UrlService;
  let urlRepository: Repository<Url>;
  let shortCodeService: ShortCodeService;

  const MOCK_SHORT_CODE = 'aBcDeF';
  const MOCK_ORIGINAL_URL = 'https://example.com/very/long/url';

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
                Promise.resolve({ id: 'some-uuid', ...url }),
              ),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
    urlRepository = module.get<Repository<Url>>(getRepositoryToken(Url));
    shortCodeService = module.get<ShortCodeService>(ShortCodeService);
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
      });
      expect(urlRepository.findOneBy).toHaveBeenCalledWith({
        shortCode: 'anotherCode',
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
