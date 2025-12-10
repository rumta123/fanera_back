import { IsString, IsOptional, MaxLength } from "class-validator";

export class CreateWorkshopDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateWorkshopDto extends CreateWorkshopDto {}
