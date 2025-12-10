// src/user-workshops/user-workshop.controller.ts
import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  Get,
} from "@nestjs/common";
import { UserWorkshopService } from "./user-workshop.service";
import { AssignUserWorkshopDto } from "./dto/assign-user-workshop.dto";

@Controller("api/user-workshops")
export class UserWorkshopController {
  constructor(private service: UserWorkshopService) {}

  @Post()
  assign(@Body() dto: AssignUserWorkshopDto) {
    return this.service.assignToWorkshop(dto);
  }

  @Delete(":userId/:workshopId")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("workshopId", ParseIntPipe) workshopId: number,
  ) {
    return this.service.removeAssignment(userId, workshopId);
  }

  // Опционально: получить все цеха пользователя
  @Get("user/:userId")
  getWorkshops(@Param("userId", ParseIntPipe) userId: number) {
    return this.service.getWorkshopsByUserId(userId);
  }
}
