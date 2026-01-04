// src/products/dto/product.dto.ts
import {
  IsString,
  IsNumber,
  IsOptional,
  MaxLength,
  IsPositive,
} from "class-validator";

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

  // ✅ НОВОЕ ПОЛЕ
  @IsNumber({}, { message: "cost_per_unit должен быть числом" })
  @IsPositive({ message: "Цена за единицу должна быть положительной" })
  @IsOptional()
  cost_per_unit?: number; // может быть null или не передан
}

export class UpdateProductDto extends CreateProductDto {}
