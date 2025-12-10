// src/cost-centers/cost-centers.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { CostCentersService } from "./cost-centers.service";
import {
  CreateCostCenterDto,
  UpdateCostCenterDto,
} from "./dto/cost-center.dto";
import { CostCenter } from "./cost-center.entity";

@Controller("cost-centers")
export class CostCentersController {
  constructor(private service: CostCentersService) {}

  @Get()
  findAll(): Promise<CostCenter[]> {
    return this.service.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Promise<CostCenter> {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCostCenterDto): Promise<CostCenter> {
    return this.service.create(dto);
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateCostCenterDto,
  ): Promise<CostCenter> {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
