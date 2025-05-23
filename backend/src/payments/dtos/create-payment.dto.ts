import {
  IsDate,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class CreatePaymentDTO {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsDate()
  paymentDate: Date;

  @IsOptional()
  @IsIn(['PENDING', 'COMPLETED', 'FAILED'])
  status: 'PENDING' | 'COMPLETED' | 'FAILED' = 'PENDING';

  @IsUUID()
  invoiceId: string;
}
