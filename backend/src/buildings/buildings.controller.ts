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

import { BuildingsService } from './buildings.service';
import { CreateBuildingDTO } from './dtos/create-building.dto';
import { UpdateBuildingDTO } from './dtos/update-building.dto';

@Controller('buildings')
export class BuildingsController {
  constructor(private readonly buildingsService: BuildingsService) {}

  @Get()
  getBuildings() {
    return this.buildingsService.getBuildings();
  }

  @Get(':id')
  getBuilding(@Param('id') id: string) {
    return this.buildingsService.getBuilding(id);
  }

  @Post()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  createBuilding(@Body() data: CreateBuildingDTO) {
    return this.buildingsService.createBuilding(data);
  }

  @Put(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  updateBuilding(@Param('id') id: string, @Body() data: UpdateBuildingDTO) {
    return this.buildingsService.updateBuilding(id, data);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  deleteBuilding(@Param('id') id: string) {
    return this.buildingsService.deleteBuilding(id);
  }
}
