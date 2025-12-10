// src/cost-centers/cost-centers.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CostCenter } from "./cost-center.entity";
import { CostCentersController } from "./cost-centers.controller";
import { CostCentersService } from "./cost-centers.service";
import { WorkshopsModule } from "../workshops/workshops.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([CostCenter]), // ← обязательно!
    WorkshopsModule,
  ],
  controllers: [CostCentersController],
  providers: [CostCentersService],
  exports: [CostCentersService],
})
export class CostCentersModule {}
