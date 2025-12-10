import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class AssignUserWorkshopDto {
  @IsInt()
  @Min(1)
  user_id: number;

  @IsInt()
  @Min(1)
  workshop_id: number;

  @IsString()
  @IsNotEmpty()
  position: string; // ← добавлено
}
