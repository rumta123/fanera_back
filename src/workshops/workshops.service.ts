// src/workshops/workshops.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Workshop } from "./workshop.entity";
import { CreateWorkshopDto, UpdateWorkshopDto } from "./dto/workshop.dto";

@Injectable()
export class WorkshopService {
  constructor(
    @InjectRepository(Workshop)
    private workshopRepository: Repository<Workshop>,
  ) {}

  findAll(): Promise<Workshop[]> {
    return this.workshopRepository.find();
  }

  async findOne(id: number): Promise<Workshop> {
    const workshop = await this.workshopRepository.findOneBy({ id });
    if (!workshop) {
      throw new NotFoundException(`Цех с ID ${id} не найден`);
    }
    return workshop;
  }
  async create(createDto: CreateWorkshopDto): Promise<Workshop> {
    const workshop = this.workshopRepository.create(createDto);
    return this.workshopRepository.save(workshop);
  }

  async update(id: number, updateDto: UpdateWorkshopDto): Promise<Workshop> {
    await this.workshopRepository.update(id, updateDto);
    const updated = await this.workshopRepository.findOneBy({ id });
    if (!updated) {
      throw new NotFoundException(`Цех с ID ${id} не найден`);
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    const result = await this.workshopRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Цех с ID ${id} не найден`);
    }
  }
}
