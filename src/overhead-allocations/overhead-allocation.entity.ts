// src/overhead-allocations/entities/overhead-allocation.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ProductionBatch } from "../production-batches/production-batch.entity";
import { CostCenter } from "../cost-centers/cost-center.entity";

@Entity("overhead_allocations")
export class OverheadAllocation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  batch_id: number;

  @ManyToOne(() => ProductionBatch)
  @JoinColumn({ name: "batch_id" })
  batch: ProductionBatch;

  @Column()
  cost_center_id: number;

  @ManyToOne(() => CostCenter)
  @JoinColumn({ name: "cost_center_id" })
  costCenter: CostCenter;

  @Column({ type: "float" })
  allocated_amount: number; // сумма, распределённая на партию (в рублях, кВт·ч и т.д.)
}
