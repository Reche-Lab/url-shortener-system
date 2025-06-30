import { Injectable } from '@nestjs/common';
import { CreateClickEventDto } from './dto/create-click-event.dto';
import { UpdateClickEventDto } from './dto/update-click-event.dto';

@Injectable()
export class ClickEventService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(_createClickEventDto: CreateClickEventDto) {
    return 'This action adds a new clickEvent';
  }

  findAll() {
    return `This action returns all clickEvent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clickEvent`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, _updateClickEventDto: UpdateClickEventDto) {
    return `This action updates a #${id} clickEvent`;
  }

  remove(id: number) {
    return `This action removes a #${id} clickEvent`;
  }
}
