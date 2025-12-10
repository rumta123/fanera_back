// src/production-batches/production-batches.controller.ts
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
import { ProductionBatchesService } from "./production-batches.service";
import {
  CreateProductionBatchDto,
  UpdateProductionBatchDto,
} from "./dto/production-batch.dto";
import { ProductionBatch } from "./production-batch.entity";

@Controller("production-batches")
export class ProductionBatchesController {
  constructor(private service: ProductionBatchesService) {}

  @Get()
  findAll(): Promise<ProductionBatch[]> {
    return this.service.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Promise<ProductionBatch> {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateProductionBatchDto): Promise<ProductionBatch> {
    return this.service.create(dto);
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateProductionBatchDto,
  ): Promise<ProductionBatch> {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
