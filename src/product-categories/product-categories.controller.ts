// src/product-categories/product-categories.controller.ts
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
import { ProductCategoriesService } from "./product-categories.service";
import {
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
} from "./dto/product-category.dto";
import { ProductCategory } from "./product-category.entity";

@Controller("product-categories")
export class ProductCategoriesController {
  constructor(private service: ProductCategoriesService) {}

  @Get()
  findAll(): Promise<ProductCategory[]> {
    return this.service.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Promise<ProductCategory> {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateProductCategoryDto): Promise<ProductCategory> {
    return this.service.create(dto);
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateProductCategoryDto,
  ): Promise<ProductCategory> {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
