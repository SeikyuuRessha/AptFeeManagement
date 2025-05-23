import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateServiceDTO {
  @IsNumber()
  @IsPositive()
  unitPrice: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
