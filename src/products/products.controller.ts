// src/products/products.controller.ts
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
import { ProductsService } from "./products.service";
import { CreateProductDto, UpdateProductDto } from "./dto/product.dto";
import { Product } from "./product.entity";

@Controller("products")
export class ProductsController {
  constructor(private service: ProductsService) {}

  @Get()
  findAll(): Promise<Product[]> {
    return this.service.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Promise<Product> {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateProductDto): Promise<Product> {
    return this.service.create(dto);
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ): Promise<Product> {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
