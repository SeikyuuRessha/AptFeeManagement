import { PartialType } from "@nestjs/mapped-types";
import { IsIn, IsOptional } from "class-validator";
import { CreateSubscriptionDTO } from "./create-subscription.dto";

export class UpdateSubscriptionDTO extends PartialType(CreateSubscriptionDTO) {
    @IsOptional()
    @IsIn(["active", "inactive", "pending"])
    status?: string;
}
