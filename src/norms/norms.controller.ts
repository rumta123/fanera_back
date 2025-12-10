// src/norms/norms.controller.ts
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
import { NormsService } from "./norms.service";
import { CreateNormDto, UpdateNormDto } from "./dto/norm.dto";
import { Norm } from "./norm.entity";

@Controller("norms")
export class NormsController {
  constructor(private service: NormsService) {}

  @Get()
  findAll(): Promise<Norm[]> {
    return this.service.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Promise<Norm> {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateNormDto): Promise<Norm> {
    return this.service.create(dto);
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateNormDto,
  ): Promise<Norm> {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }

  // Опциональный эндпоинт: получить активные нормы по дате
  @Get("active/:productId/:workshopId/:date")
  findActive(
    @Param("productId", ParseIntPipe) productId: number,
    @Param("workshopId", ParseIntPipe) workshopId: number,
    @Param("date") date: string,
  ): Promise<Norm[]> {
    return this.service.findActiveNorms(productId, workshopId, date);
  }
}
