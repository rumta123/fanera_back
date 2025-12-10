// src/batch-facts/dto/batch-fact.dto.ts
import { IsNumber, IsString, IsOptional, Min } from "class-validator";

export class CreateBatchFactDto {
  @IsNumber()
  batch_id: number;

  @IsNumber()
  product_id: number;

  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0.0001)
  actual_quantity: number;

  @IsString()
  @IsOptional()
  deviation_reason?: string;
}

export class UpdateBatchFactDto {
  @IsNumber()
  @IsOptional()
  batch_id?: number;

  @IsNumber()
  @IsOptional()
  product_id?: number;

  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0.0001)
  @IsOptional()
  actual_quantity?: number;

  @IsString()
  @IsOptional()
  deviation_reason?: string;
}
