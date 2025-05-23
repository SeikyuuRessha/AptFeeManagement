import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateBuildingDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsPositive()
  apartmentCount: number;
}
