// src/batch-facts/entities/batch-fact.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ProductionBatch } from "../production-batches/production-batch.entity";
import { Product } from "../products/product.entity";

@Entity("batch_facts")
export class BatchFact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  batch_id: number;

  @ManyToOne(() => ProductionBatch)
  @JoinColumn({ name: "batch_id" })
  batch: ProductionBatch;

  @Column()
  product_id: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Column({ type: "float" })
  actual_quantity: number;

  @Column({ type: "varchar", length: 255, nullable: true }) // ← явно указан тип
  deviation_reason: string | null;
}
