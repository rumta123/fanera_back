import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from "typeorm";
import { User } from "../users/users.entity";

@Entity("audit_logs")
@Index(["userId"])
@Index(["entityType", "entityId"])
@Index(["timestamp"])
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user_id", nullable: true }) // null — если действие системное
  userId: number | null;

  @ManyToOne(() => User, (user) => user.auditLogs, { onDelete: "SET NULL" })
  @JoinColumn({ name: "user_id" })
  user: User | null;

  @Column({ name: "action", length: 255 })
  action: string;

  @Column({ name: "entity_type", length: 50 })
  entityType: string;

  @Column({ name: "entity_id" })
  entityId: number;

  @CreateDateColumn({ name: "timestamp" })
  timestamp: Date;
}
