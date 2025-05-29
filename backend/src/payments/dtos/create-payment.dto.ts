import { IsDate, IsIn, IsNumber, IsOptional, IsPositive, IsUUID } from "class-validator";
import { Type } from "class-transformer";

export class CreatePaymentDTO {
    @IsNumber()
    @IsPositive()
    amount: number;
    @IsDate()
    @Type(() => Date)
    paymentDate: Date;

    @IsOptional()
    @IsIn(["PENDING", "COMPLETED", "FAILED"])
    status: "PENDING" | "COMPLETED" | "FAILED" = "PENDING";

    @IsUUID()
    invoiceId: string;
}
