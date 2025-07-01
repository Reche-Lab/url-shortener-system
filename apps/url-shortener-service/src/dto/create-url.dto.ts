import { IsUrl, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty({
    example: 'https://www.exemplo.com',
    description: 'URL original que será encurtada',
  })
  @IsUrl({}, { message: 'originalUrl must be a valid URL' })
  @IsNotEmpty({ message: 'originalUrl cannot be empty' })
  originalUrl: string;
}
