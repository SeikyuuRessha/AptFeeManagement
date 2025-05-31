import { IsNumber, IsPositive, IsUUID, IsOptional } from "class-validator";

export class CreateInvoiceDetailDTO {
    @IsNumber()
    @IsPositive()
    quantity: number;

    @IsUUID()
    @IsOptional()
    invoiceId?: string;

    @IsUUID()
    apartmentId: string;

    @IsUUID()
    subscriptionId: string;
}
