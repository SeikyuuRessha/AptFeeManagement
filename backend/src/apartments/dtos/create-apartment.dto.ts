import { IsNumber, IsPositive, IsUUID } from 'class-validator';

export class CreateApartmentDTO {
  @IsNumber()
  @IsPositive()
  roomNumber: number;

  @IsNumber()
  @IsPositive()
  area: number;

  @IsUUID()
  buildingId: string;
}
