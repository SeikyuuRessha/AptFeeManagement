import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ApartmentsModule } from './apartments/apartments.module';
import { AuthModule } from './auth/auth.module';
import { BuildingsModule } from './buildings/buildings.module';
import { ContractsModule } from './contracts/contracts.module';
import { PrismaModule } from './prisma/prisma.module';
import { InvoiceDetailsModule } from './invoice-details/invoice-details.module';
import { InvoicesModule } from './invoices/invoices.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentsModule } from './payments/payments.module';
import { ResidentsModule } from './residents/residents.module';
import { ServicesModule } from './services/services.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ApartmentsModule,
    AuthModule,
    ContractsModule,
    BuildingsModule,
    InvoiceDetailsModule,
    InvoicesModule,
    NotificationsModule,
    PaymentsModule,
    ResidentsModule,
    ServicesModule,
    SubscriptionsModule,
  ],
})
export class AppModule {}
