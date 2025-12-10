import {
  IsNumber,
  IsDateString,
  IsEnum,
  Min,
  IsOptional,
} from "class-validator";

const BATCH_STATUSES = ["в работе", "завершена", "отменена"] as const;
type BatchStatus = (typeof BATCH_STATUSES)[number];

export class CreateProductionBatchDto {
  @IsNumber()
  product_id: number;

  @IsNumber()
  workshop_id: number;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;

  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0.0001)
  planned_quantity: number;

  @IsNumber({ maxDecimalPlaces: 4 })
  @IsOptional()
  actual_quantity?: number;

  @IsEnum(BATCH_STATUSES)
  @IsOptional()
  status?: BatchStatus = "в работе";

  // 🔹 ИСПРАВЛЕНО: IsNumber вместо IsDecimal
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  planned_cost?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  actual_cost?: number;
}

export class UpdateProductionBatchDto {
  @IsNumber()
  @IsOptional()
  product_id?: number;

  @IsNumber()
  @IsOptional()
  workshop_id?: number;

  @IsDateString()
  @IsOptional()
  start_date?: string;

  @IsDateString()
  @IsOptional()
  end_date?: string;

  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0.0001)
  @IsOptional()
  planned_quantity?: number;

  @IsNumber({ maxDecimalPlaces: 4 })
  @IsOptional()
  actual_quantity?: number;

  @IsEnum(BATCH_STATUSES)
  @IsOptional()
  status?: BatchStatus;

  // 🔹 ИСПРАВЛЕНО
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  planned_cost?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  actual_cost?: number;
}
