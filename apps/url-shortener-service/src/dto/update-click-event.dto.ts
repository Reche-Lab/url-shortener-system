import { PartialType } from '@nestjs/mapped-types';
import { CreateClickEventDto } from './create-click-event.dto';

export class UpdateClickEventDto extends PartialType(CreateClickEventDto) {}
