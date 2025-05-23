import { Roles } from 'src/common/decorators/roles.decorator';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { CreateNotificationDTO } from './dtos/create-nofication.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getNotifications() {
    return this.notificationsService.getNotifications();
  }

  @Get(':id')
  getNofication(@Param('id') id: string) {
    return this.notificationsService.getNofication(id);
  }

  @Post()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  createNotificaiton(@Body() data: CreateNotificationDTO) {
    return this.notificationsService.createNofication(data);
  }
}
