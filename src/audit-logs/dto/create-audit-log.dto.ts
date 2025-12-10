import { IsInt, IsString, IsOptional, Min } from "class-validator";

export class CreateAuditLogDto {
  @IsInt()
  @IsOptional()
  @Min(1)
  userId?: number; // опционально, для системных действий

  @IsString()
  action: string;

  @IsString()
  entityType: string;

  @IsInt()
  @Min(1)
  entityId: number;
}
