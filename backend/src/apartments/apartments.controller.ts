import { Request } from "express";
import { Roles } from "../common/decorators/roles.decorator";
import { AccessTokenGuard } from "../common/guards/accessToken.guard";
import { RolesGuard } from "../common/guards/roles.guard";

import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";

import { ApartmentsService } from "./apartments.service";
import { CreateApartmentDTO } from "./dtos/create-apartment.dto";
import { UpdateApartmentDTO } from "./dtos/update-apartment.dto";

@Controller("apartments")
export class ApartmentsController {
    constructor(private readonly apartmentsService: ApartmentsService) {}
    @Post()
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles("admin")
    createApartment(@Body() data: CreateApartmentDTO, @Req() req: Request) {
        const residentId = req.body.residentId;
        return this.apartmentsService.createApartment(data, residentId);
    }

    @Get()
    getApartments() {
        return this.apartmentsService.getApartments();
    }

    @Get(":id")
    getApartment(@Param("id") id: string) {
        return this.apartmentsService.getApartment(id);
    }

    @Put(":id")
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles("admin")
    updateApartment(@Param("id") id: string, @Body() data: UpdateApartmentDTO) {
        return this.apartmentsService.updateApartment(id, data);
    }
    @Put(":id/assign-resident")
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles("admin")
    assignResident(@Param("id") apartmentId: string, @Body("residentId") residentId: string | null) {
        return this.apartmentsService.assignResident(apartmentId, residentId);
    }

    @Delete(":id")
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles("admin")
    deleteApartment(@Param("id") id: string) {
        return this.apartmentsService.deleteApartment(id);
    }
}
