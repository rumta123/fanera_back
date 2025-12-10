// src/overhead-allocations/overhead-allocations.controller.ts
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
import { OverheadAllocationsService } from "./overhead-allocations.service";
import {
  CreateOverheadAllocationDto,
  UpdateOverheadAllocationDto,
} from "./dto/overhead-allocation.dto";
import { OverheadAllocation } from "./overhead-allocation.entity";

@Controller("overhead-allocations")
export class OverheadAllocationsController {
  constructor(private service: OverheadAllocationsService) {}

  @Get()
  findAll(): Promise<OverheadAllocation[]> {
    return this.service.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Promise<OverheadAllocation> {
    return this.service.findOne(id);
  }

  @Post()
  create(
    @Body() dto: CreateOverheadAllocationDto,
  ): Promise<OverheadAllocation> {
    return this.service.create(dto);
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateOverheadAllocationDto,
  ): Promise<OverheadAllocation> {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }

  @Get("by-batch/:batchId")
  findByBatch(
    @Param("batchId", ParseIntPipe) batchId: number,
  ): Promise<OverheadAllocation[]> {
    return this.service.findByBatchId(batchId);
  }
}
