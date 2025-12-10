// src/cost-centers/entities/cost-center.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Workshop } from "../workshops/workshop.entity";

@Entity("cost_centers")
export class CostCenter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string; // «Электроэнергия», «Амортизация», «Ремонт»

  @Column()
  workshop_id: number;

  @ManyToOne(() => Workshop)
  @JoinColumn({ name: "workshop_id" })
  workshop: Workshop;
}
