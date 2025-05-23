import { IsDate, IsIn, IsString, IsUUID } from 'class-validator';
import { Frequency } from '../../common/enums';

export class CreateSubscriptionDTO {
  @IsIn(Object.values(Frequency))
  frequency: string;

  @IsDate()
  nextBillingDate: Date;

  @IsUUID()
  apartmentId: string;

  @IsUUID()
  serviceId: string;
}
