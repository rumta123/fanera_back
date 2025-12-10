// src/norms/entities/norm.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Product } from "../products/product.entity";
import { Workshop } from "../workshops/workshop.entity";

@Entity("norms")
export class Norm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_id: number; // финальный продукт (фанера)

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Column()
  input_product_id: number; // сырьё или полуфабрикат (шпон, клей)

  @ManyToOne(() => Product)
  @JoinColumn({ name: "input_product_id" })
  inputProduct: Product;

  @Column({ type: "float" })
  quantity_per_unit: number; // 0.4 м³ шпона на 1 м³ фанеры

  @Column({ type: "date" })
  period_start: string; // ISO date: '2025-11-01'

  @Column({ type: "date" })
  period_end: string; // ISO date: '2025-12-31'

  @Column()
  workshop_id: number;

  @ManyToOne(() => Workshop)
  @JoinColumn({ name: "workshop_id" })
  workshop: Workshop;
}
