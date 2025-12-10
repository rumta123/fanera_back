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
import { BatchFactsService } from "./batch-facts.service";
import { CreateBatchFactDto, UpdateBatchFactDto } from "./dto/batch-fact.dto";
import { BatchFact } from "./batch-fact.entity";

@Controller("batch-facts")
export class BatchFactsController {
  constructor(private service: BatchFactsService) {}

  @Get()
  findAll(): Promise<BatchFact[]> {
    return this.service.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Promise<BatchFact> {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateBatchFactDto): Promise<BatchFact> {
    return this.service.create(dto);
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateBatchFactDto,
  ): Promise<BatchFact> {
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
  ): Promise<BatchFact[]> {
    return this.service.findByBatchId(batchId);
  }
}
