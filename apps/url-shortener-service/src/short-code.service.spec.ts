import { Test, TestingModule } from '@nestjs/testing';
import { ShortCodeService } from './short-code.service';

describe('ShortCodeService', () => {
  let service: ShortCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShortCodeService],
    }).compile();

    service = module.get<ShortCodeService>(ShortCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a short code of 6 characters', () => {
    const shortCode = service.generateShortCode();
    expect(shortCode).toBeDefined();
    expect(typeof shortCode).toBe('string');
    expect(shortCode.length).toBe(6);
  });

  it('should generate different short codes on successive calls', () => {
    const code1 = service.generateShortCode();
    const code2 = service.generateShortCode();
    expect(code1).not.toEqual(code2);
  });

  it('should generate short codes using alphanumeric characters (base62)', () => {
    const shortCode = service.generateShortCode();
    expect(shortCode).toMatch(/^[0-9a-zA-Z]{6}$/);
  });
});
