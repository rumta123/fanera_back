import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Role } from "../roles/role.entity";
import { AuditLog } from "../audit-logs/audit-log.entity";
import { UserWorkshop } from "../user-workshops/user-workshop.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  password: string;

  @Column({ nullable: true, unique: true })
  phone: string;

  @CreateDateColumn()
  createdAt: Date; // 🔹 Дата регистрации

  @UpdateDateColumn()
  updatedAt: Date; // 🔹 Дата последнего обновления

  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable({
    name: "user_roles",
    joinColumn: { name: "user_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "role_id", referencedColumnName: "id" },
  })
  roles: Role[];
  @OneToMany(() => AuditLog, (log) => log.user)
  auditLogs: AuditLog[];

  @OneToMany(() => UserWorkshop, (userWorkshop) => userWorkshop.user_id)
  userWorkshops: UserWorkshop[];
}
