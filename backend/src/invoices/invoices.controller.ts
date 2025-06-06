import { Controller, Delete, Get, Param, UseGuards } from "@nestjs/common";
import { InvoicesService } from "./invoices.service";
import { AccessTokenGuard } from "../common/guards/accessToken.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";

@Controller("invoices")
export class InvoicesController {
    constructor(private readonly invoicesService: InvoicesService) {}

    @Get()
    getInvoices() {
        return this.invoicesService.getInvoices();
    }

    @Get(":id")
    getInvoice(@Param("id") id: string) {
        return this.invoicesService.getInvoice(id);
    }

    @Delete(":id")
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles("admin")
    deleteInvoice(@Param("id") id: string) {
        return this.invoicesService.deleteInvoice(id);
    }
}
