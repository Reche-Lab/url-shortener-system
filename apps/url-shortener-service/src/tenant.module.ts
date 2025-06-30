import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { ClickEventModule } from './click-event.module';

@Module({
  controllers: [TenantController],
  providers: [TenantService],
  imports: [ClickEventModule],
})
export class TenantModule {}
