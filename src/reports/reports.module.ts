// src/reports/reports.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductionBatch } from "../production-batches/production-batch.entity";
import { BatchFact } from "../batch-facts/batch-fact.entity";
import { Norm } from "../norms/norm.entity";
import { Product } from "../products/product.entity";
import { Workshop } from "../workshops/workshop.entity";
import { ReportsController } from "./reports.controller";
import { ReportsService } from "./reports.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductionBatch,
      BatchFact,
      Norm,
      Product,
      Workshop,
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
