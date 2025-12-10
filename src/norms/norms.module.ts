// src/norms/norms.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Norm } from "./norm.entity"; // ← сущность
import { NormsController } from "./norms.controller";
import { NormsService } from "./norms.service";
import { ProductsModule } from "../products/products.module";
import { WorkshopsModule } from "../workshops/workshops.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Norm]), // ← обязательно!
    ProductsModule,
    WorkshopsModule,
  ],
  controllers: [NormsController],
  providers: [NormsService],
  exports: [NormsService],
})
export class NormsModule {}
