import { IsNumber, IsOptional, IsPositive, IsUUID } from "class-validator";

export class CreateApartmentDTO {
    @IsNumber()
    @IsPositive()
    roomNumber: number;

    @IsNumber()
    @IsPositive()
    area: number;

    @IsUUID()
    @IsOptional()
    buildingId: string = "";
}
