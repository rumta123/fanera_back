// src/user-workshops/user-workshop.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserWorkshop } from "./user-workshop.entity";
import { UserWorkshopService } from "./user-workshop.service";
import { UserWorkshopController } from "./user-workshop.controller";
import { UsersModule } from "../users/users.module";
import { WorkshopsModule } from "../workshops/workshops.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserWorkshop]),
    UsersModule,
    WorkshopsModule,
  ],
  providers: [UserWorkshopService],
  controllers: [UserWorkshopController],
  exports: [UserWorkshopService],
})
export class UserWorkshopModule {}
