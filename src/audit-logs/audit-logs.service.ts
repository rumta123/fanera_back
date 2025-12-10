import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuditLog } from "./audit-log.entity";
import { CreateAuditLogDto } from "./dto/create-audit-log.dto";

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async create(createDto: CreateAuditLogDto): Promise<AuditLog> {
    const log = this.auditLogRepository.create(createDto);
    return await this.auditLogRepository.save(log);
  }

  async findAll(): Promise<AuditLog[]> {
    return await this.auditLogRepository.find({
      relations: ["user"],
      order: { timestamp: "DESC" },
    });
  }

  async findByUser(userId: number): Promise<AuditLog[]> {
    return await this.auditLogRepository.find({
      where: { userId },
      relations: ["user"],
      order: { timestamp: "DESC" },
    });
  }

  async findByEntity(
    entityType: string,
    entityId: number,
  ): Promise<AuditLog[]> {
    return await this.auditLogRepository.find({
      where: { entityType, entityId },
      relations: ["user"],
      order: { timestamp: "DESC" },
    });
  }

  async findLastActions(limit = 10): Promise<AuditLog[]> {
    return await this.auditLogRepository.find({
      relations: ["user"],
      order: { timestamp: "DESC" },
      take: limit,
    });
  }
}
