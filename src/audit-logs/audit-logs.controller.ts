import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuditLogsService } from "./audit-logs.service";
import { CreateAuditLogDto } from "./dto/create-audit-log.dto";
import { AuditLog } from "./audit-log.entity";

@Controller("audit-logs")
@UseGuards(AuthGuard("jwt")) // только для авторизованных (админов)
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  // Обычно логи создаются автоматически, но оставим для тестов
  @Post()
  create(@Body() createDto: CreateAuditLogDto): Promise<AuditLog> {
    return this.auditLogsService.create(createDto);
  }

  @Get()
  findAll(): Promise<AuditLog[]> {
    return this.auditLogsService.findAll();
  }

  @Get("user/:userId")
  findByUser(
    @Param("userId", ParseIntPipe) userId: number,
  ): Promise<AuditLog[]> {
    return this.auditLogsService.findByUser(userId);
  }

  @Get("entity/:entityType/:entityId")
  findByEntity(
    @Param("entityType") entityType: string,
    @Param("entityId", ParseIntPipe) entityId: number,
  ): Promise<AuditLog[]> {
    return this.auditLogsService.findByEntity(entityType, entityId);
  }

  @Get("last/:limit")
  findLastActions(
    @Param("limit", ParseIntPipe) limit: number,
  ): Promise<AuditLog[]> {
    return this.auditLogsService.findLastActions(limit);
  }
}
