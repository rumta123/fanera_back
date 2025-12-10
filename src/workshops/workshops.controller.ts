import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
} from "@nestjs/common";
import { WorkshopService } from "./workshops.service";
import { CreateWorkshopDto, UpdateWorkshopDto } from "./dto/workshop.dto";
import { Workshop } from "./workshop.entity";

@Controller("workshops")
export class WorkshopController {
  constructor(private readonly workshopService: WorkshopService) {}

  @Get()
  findAll(): Promise<Workshop[]> {
    return this.workshopService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: number): Promise<Workshop> {
    return this.workshopService.findOne(id);
  }

  @Post()
  create(@Body() createDto: CreateWorkshopDto): Promise<Workshop> {
    return this.workshopService.create(createDto);
  }

  @Put(":id")
  update(
    @Param("id") id: number,
    @Body() updateDto: UpdateWorkshopDto,
  ): Promise<Workshop> {
    return this.workshopService.update(id, updateDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: number): Promise<void> {
    return this.workshopService.remove(id);
  }
}
