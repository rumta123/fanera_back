// src/norms/dto/norm.dto.ts
import { IsNumber, IsDateString, Min } from "class-validator";

export class CreateNormDto {
  @IsNumber()
  product_id: number; // финальный продукт

  @IsNumber()
  input_product_id: number; // сырьё

  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0.0001)
  quantity_per_unit: number;

  @IsDateString()
  period_start: string;

  @IsDateString()
  period_end: string;

  @IsNumber()
  workshop_id: number;
}

export class UpdateNormDto extends CreateNormDto {}
