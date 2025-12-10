// src/production-batches/production-batches.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductionBatch } from "./production-batch.entity";
import { ProductionBatchesController } from "./production-batches.controller";
import { ProductionBatchesService } from "./production-batches.service";
import { ProductsModule } from "../products/products.module";
import { WorkshopsModule } from "../workshops/workshops.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductionBatch]), // ← обязательно!
    ProductsModule,
    WorkshopsModule,
  ],
  controllers: [ProductionBatchesController],
  providers: [ProductionBatchesService],
  exports: [ProductionBatchesService],
})
export class ProductionBatchesModule {}
