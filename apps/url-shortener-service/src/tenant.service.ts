import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(_createTenantDto: CreateTenantDto) {
    return 'This action adds a new tenant';
  }

  findAll() {
    return `This action returns all tenant`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tenant`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, _updateTenantDto: UpdateTenantDto) {
    return `This action updates a #${id} tenant`;
  }

  remove(id: number) {
    return `This action removes a #${id} tenant`;
  }
}
