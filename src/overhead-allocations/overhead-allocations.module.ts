// src/overhead-allocations/overhead-allocations.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OverheadAllocation } from "./overhead-allocation.entity";
import { OverheadAllocationsController } from "./overhead-allocations.controller";
import { OverheadAllocationsService } from "./overhead-allocations.service";
import { ProductionBatchesModule } from "../production-batches/production-batches.module";
import { CostCentersModule } from "../cost-centers/cost-centers.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([OverheadAllocation]), // ← обязательно!
    ProductionBatchesModule,
    CostCentersModule,
  ],
  controllers: [OverheadAllocationsController],
  providers: [OverheadAllocationsService],
  exports: [OverheadAllocationsService],
})
export class OverheadAllocationsModule {}
