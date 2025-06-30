import { Injectable } from '@nestjs/common';
import { CreateClickEventDto } from './dto/create-click-event.dto';
import { UpdateClickEventDto } from './dto/update-click-event.dto';

@Injectable()
export class ClickEventService {
  create(createClickEventDto: CreateClickEventDto) {
    return 'This action adds a new clickEvent';
  }

  findAll() {
    return `This action returns all clickEvent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clickEvent`;
  }

  update(id: number, updateClickEventDto: UpdateClickEventDto) {
    return `This action updates a #${id} clickEvent`;
  }

  remove(id: number) {
    return `This action removes a #${id} clickEvent`;
  }
}
