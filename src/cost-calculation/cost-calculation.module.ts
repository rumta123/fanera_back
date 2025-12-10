// src/cost-calculation/cost-calculation.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductionBatch } from "../production-batches/production-batch.entity";
import { BatchFact } from "../batch-facts/batch-fact.entity";
import { OverheadAllocation } from "../overhead-allocations/overhead-allocation.entity";
import { Product } from "../products/product.entity";
import { CostCenter } from "../cost-centers/cost-center.entity";
import { CostCalculationController } from "./cost-calculation.controller";
import { CostCalculationService } from "./cost-calculation.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductionBatch,
      BatchFact,
      OverheadAllocation,
      Product,
      CostCenter,
    ]),
  ],
  controllers: [CostCalculationController],
  providers: [CostCalculationService],
})
export class CostCalculationModule {}
