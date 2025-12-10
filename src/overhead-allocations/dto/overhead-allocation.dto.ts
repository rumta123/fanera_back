// src/overhead-allocations/dto/overhead-allocation.dto.ts
import { IsNumber, IsOptional, Min } from "class-validator";

export class CreateOverheadAllocationDto {
  @IsNumber()
  batch_id: number;

  @IsNumber()
  cost_center_id: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  allocated_amount: number;
}

export class UpdateOverheadAllocationDto {
  @IsNumber()
  @IsOptional()
  batch_id?: number;

  @IsNumber()
  @IsOptional()
  cost_center_id?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  allocated_amount?: number;
}
