import { Roles } from 'src/common/decorators/roles.decorator';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { CreatePaymentDTO } from './dtos/create-payment.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  getPayments() {
    return this.paymentsService.getPayments();
  }

  @Get(':id')
  getPayment(@Param('id') id: string) {
    return this.paymentsService.getPayment(id);
  }

  @Post()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  createPayment(@Body() data: CreatePaymentDTO) {
    return this.paymentsService.createPayment(data);
  }
}
