import { IsDate, IsIn, IsNumber, IsOptional, IsPositive, IsUUID } from "class-validator";
import { Type } from "class-transformer";
import { get } from "http";

export class CreatePaymentDTO {
    @IsNumber()
    @IsPositive()
    amount: number;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    paymentDate: Date = new Date(Date.now());

    @IsOptional()
    @IsIn(["PENDING", "COMPLETED", "FAILED"])
    status: "PENDING" | "COMPLETED" | "FAILED" = "COMPLETED";

    @IsUUID()
    invoiceId: string;
}
