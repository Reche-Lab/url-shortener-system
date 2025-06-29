/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsUrl, IsNotEmpty } from 'class-validator';

export class CreateUrlDto {
  @IsUrl({}, { message: 'originalUrl must be a valid URL' })
  @IsNotEmpty({ message: 'originalUrl cannot be empty' })
  originalUrl: string;
}
