import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClickEventService } from './click-event.service';
import { CreateClickEventDto } from './dto/create-click-event.dto';
import { UpdateClickEventDto } from './dto/update-click-event.dto';

@Controller('click-event')
export class ClickEventController {
  constructor(private readonly clickEventService: ClickEventService) {}

  @Post()
  create(@Body() createClickEventDto: CreateClickEventDto) {
    return this.clickEventService.create(createClickEventDto);
  }

  @Get()
  findAll() {
    return this.clickEventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clickEventService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClickEventDto: UpdateClickEventDto,
  ) {
    return this.clickEventService.update(+id, updateClickEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clickEventService.remove(+id);
  }
}
