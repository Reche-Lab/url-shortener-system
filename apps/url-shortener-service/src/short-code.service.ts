import { Injectable } from '@nestjs/common';

@Injectable()
export class ShortCodeService {
  private readonly characters =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private readonly codeLength = 6;

  generateShortCode(): string {
    let result = '';
    for (let i = 0; i < this.codeLength; i++) {
      result += this.characters.charAt(
        Math.floor(Math.random() * this.characters.length),
      );
    }
    return result;
  }
}
