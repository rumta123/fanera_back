// src/production-batches/entities/production-batch.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Product } from "../products/product.entity";
import { Workshop } from "../workshops/workshop.entity";
import { BatchFact } from "../batch-facts/batch-fact.entity";
import { OverheadAllocation } from "../overhead-allocations/overhead-allocation.entity";

// Типы статусов — можно вынести в enum, но для простоты используем string
const BATCH_STATUSES = ["в работе", "завершена", "отменена"] as const;
export type BatchStatus = (typeof BATCH_STATUSES)[number];

@Entity("production_batches")
export class ProductionBatch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_id: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Column()
  workshop_id: number;

  @ManyToOne(() => Workshop)
  @JoinColumn({ name: "workshop_id" })
  workshop: Workshop;

  @Column({ type: "date" })
  start_date: string; // 'YYYY-MM-DD'

  @Column({ type: "date" })
  end_date: string;

  @Column({ type: "float" })
  planned_quantity: number;

  @Column({ type: "float", nullable: true })
  actual_quantity: number | null;

  @Column({
    type: "enum",
    enum: BATCH_STATUSES,
    default: "в работе",
  })
  status: BatchStatus;

  // 🔹 Плановая и фактическая себестоимость всей партии
  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
  planned_cost?: number | null;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
  actual_cost?: number | null;

  // 🔹 СВЯЗИ ДЛЯ КАСКАДНОГО УДАЛЕНИЯ
  @OneToMany(() => BatchFact, (fact) => fact.batch, {
    cascade: true,
    onDelete: "CASCADE",
  })
  facts: BatchFact[];

  @OneToMany(() => OverheadAllocation, (alloc) => alloc.batch, {
    cascade: true,
    onDelete: "CASCADE",
  })
  overheads: OverheadAllocation[];
}
