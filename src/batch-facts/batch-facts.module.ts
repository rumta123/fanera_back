// src/batch-facts/batch-facts.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BatchFact } from "./batch-fact.entity";
import { BatchFactsController } from "./batch-facts.controller";
import { BatchFactsService } from "./batch-facts.service";
import { ProductionBatchesModule } from "../production-batches/production-batches.module";
import { ProductsModule } from "../products/products.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([BatchFact]), // ← обязательно!
    ProductionBatchesModule,
    ProductsModule,
  ],
  controllers: [BatchFactsController],
  providers: [BatchFactsService],
  exports: [BatchFactsService],
})
export class BatchFactsModule {}
