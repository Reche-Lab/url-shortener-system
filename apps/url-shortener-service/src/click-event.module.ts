import { Module } from '@nestjs/common';
import { ClickEventService } from './click-event.service';
import { ClickEventController } from './click-event.controller';

@Module({
  controllers: [ClickEventController],
  providers: [ClickEventService],
})
export class ClickEventModule {}
