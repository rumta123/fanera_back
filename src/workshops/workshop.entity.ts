// src/workshops/entities/workshop.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("workshops")
export class Workshop {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ nullable: true })
  description: string;
}
