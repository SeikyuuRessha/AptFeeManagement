import { Controller, Delete, Get, Param, Post, Put, UseGuards, Body } from "@nestjs/common";
import { ContractsService } from "./contracts.service";
import { CreateContractDto } from "./dtos/create-contract.dto";
import { UpdateContractDTO } from "./dtos/update-contract.dto";
import { AccessTokenGuard } from "../common/guards/accessToken.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";

@Controller("contracts")
export class ContractsController {
    constructor(private readonly contractsService: ContractsService) {}

    @Get()
    getContracts() {
        return this.contractsService.getContracts();
    }

    @Get(":id")
    getContract(id: string) {
        return this.contractsService.getContract(id);
    }
    @Post()
    @Roles("admin")
    @UseGuards(AccessTokenGuard, RolesGuard)
    createContract(@Body() data: CreateContractDto) {
        return this.contractsService.createContract(data, data.residentId);
    }

    @Put(":id")
    @Roles("admin")
    @UseGuards(AccessTokenGuard, RolesGuard)
    updateContract(@Param("id") id: string, @Body() data: UpdateContractDTO) {
        return this.contractsService.updateContract(id, data);
    }

    @Delete(":id")
    @Roles("admin")
    @UseGuards(AccessTokenGuard, RolesGuard)
    deleteContract(@Param("id") id: string) {
        return this.contractsService.deleteContract(id);
    }
}
