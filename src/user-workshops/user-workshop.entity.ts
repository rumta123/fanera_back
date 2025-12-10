import { Entity, PrimaryColumn, CreateDateColumn, Column } from "typeorm";
// import { Users } from "../users/users.entity";
// import { Workshop } from "./workshop.entity";
@Entity("user_workshops")
export class UserWorkshop {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  workshop_id: number;

  // Опционально: дата привязки
  @CreateDateColumn()
  assigned_at?: Date;

  @Column({ default: "technologist" }) // ← новое поле
  position: string; // например: 'technologist', 'operator', 'engineer'

  // Связи (для удобства при JOIN-запросах, если нужно)
  // user: User;
  // workshop: Workshop;
}
