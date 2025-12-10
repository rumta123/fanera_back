// src/products/dto/product.dto.ts
import { IsString, IsNumber, IsOptional, MaxLength } from "class-validator";

export class CreateProductDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  sku: string;

  @IsNumber({}, { message: "category_id должен быть числом" })
  category_id: number;

  @IsString()
  @IsOptional()
  sort?: string;

  @IsNumber({}, { message: "thickness_mm должен быть числом" })
  @IsOptional()
  thickness_mm?: number;

  @IsString()
  @IsOptional()
  dimensions?: string;

  @IsString()
  unit: string; // обязательно: м³, кг, лист и т.п.
}

export class UpdateProductDto extends CreateProductDto {}
