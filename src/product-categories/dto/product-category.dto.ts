// src/product-categories/dto/product-category.dto.ts
import { IsString, MaxLength } from "class-validator";

export class CreateProductCategoryDto {
  @IsString()
  @MaxLength(100)
  name: string;
}

export class UpdateProductCategoryDto extends CreateProductCategoryDto {}
