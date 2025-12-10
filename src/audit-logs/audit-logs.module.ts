import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuditLog } from "./audit-log.entity";
import { AuditLogsService } from "./audit-logs.service";
import { AuditLogsController } from "./audit-logs.controller";
import { User } from "../users/users.entity";

@Module({
  // ← ДОБАВЬТЕ @ ПЕРЕД Module!
  imports: [TypeOrmModule.forFeature([AuditLog, User])],
  providers: [AuditLogsService],
  controllers: [AuditLogsController],
  exports: [AuditLogsService],
})
export class AuditLogsModule {}
