// src/cost-centers/dto/cost-center.dto.ts
import { IsString, IsNumber, MaxLength } from "class-validator";

export class CreateCostCenterDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsNumber()
  workshop_id: number;
}

export class UpdateCostCenterDto extends CreateCostCenterDto {}
