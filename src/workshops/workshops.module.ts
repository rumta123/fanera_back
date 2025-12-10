// src/workshops/workshops.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Workshop } from "./workshop.entity";
import { WorkshopController } from "./workshops.controller";
import { WorkshopService } from "./workshops.service";

@Module({
  imports: [TypeOrmModule.forFeature([Workshop])],
  controllers: [WorkshopController],
  providers: [WorkshopService],
  exports: [WorkshopService],
})
export class WorkshopsModule {}
