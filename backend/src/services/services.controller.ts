import { Roles } from 'src/common/decorators/roles.decorator';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { CreateServiceDTO } from './dtos/create-service.dto';
import { UpdateServiceDTO } from './dtos/update-service.dto';
import { ServicesService } from './services.service';

@Controller('services')
@UseGuards(AccessTokenGuard, RolesGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @Roles('admin')
  getServices() {
    return this.servicesService.getServices();
  }

  @Get(':id')
  @Roles('admin')
  getService(@Param('id') id: string) {
    return this.servicesService.getService(id);
  }

  @Post()
  @Roles('admin')
  createService(@Body() data: CreateServiceDTO) {
    return this.servicesService.createService(data);
  }

  @Put(':id')
  @Roles('admin')
  updateService(@Param('id') id: string, @Body() data: UpdateServiceDTO) {
    return this.servicesService.updateService(id, data);
  }

  @Delete(':id')
  @Roles('admin')
  deleteService(@Param('id') id: string) {
    return this.servicesService.deleteService(id);
  }
}
