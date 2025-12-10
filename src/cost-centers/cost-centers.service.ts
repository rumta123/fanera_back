// src/cost-centers/cost-centers.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CostCenter } from "./cost-center.entity";
import {
  CreateCostCenterDto,
  UpdateCostCenterDto,
} from "./dto/cost-center.dto";
import { WorkshopService } from "../workshops/workshops.service";

@Injectable()
export class CostCentersService {
  constructor(
    @InjectRepository(CostCenter)
    private costCenterRepo: Repository<CostCenter>,
    private workshopService: WorkshopService,
  ) {}

  findAll(): Promise<CostCenter[]> {
    return this.costCenterRepo.find();
  }

  async findOne(id: number): Promise<CostCenter> {
    const costCenter = await this.costCenterRepo.findOneBy({ id });
    if (!costCenter) {
      throw new NotFoundException(`Центр затрат с ID ${id} не найден`);
    }
    return costCenter;
  }

  async create(dto: CreateCostCenterDto): Promise<CostCenter> {
    // Проверяем, что цех существует
    await this.workshopService.findOne(dto.workshop_id);

    // Проверяем дубликат: нельзя иметь два одинаковых центра в одном цехе
    const existing = await this.costCenterRepo.findOneBy({
      name: dto.name,
      workshop_id: dto.workshop_id,
    });
    if (existing) {
      throw new BadRequestException(
        `Центр затрат "${dto.name}" уже существует в этом цехе`,
      );
    }

    const costCenter = this.costCenterRepo.create(dto);
    return this.costCenterRepo.save(costCenter);
  }

  async update(id: number, dto: UpdateCostCenterDto): Promise<CostCenter> {
    const exists = await this.costCenterRepo.existsBy({ id });
    if (!exists) {
      throw new NotFoundException(`Центр затрат с ID ${id} не найден`);
    }

    if ("workshop_id" in dto) {
      await this.workshopService.findOne(dto.workshop_id);
    }

    // Проверка дубликата при обновлении
    if ("name" in dto || "workshop_id" in dto) {
      const existing = await this.costCenterRepo
        .createQueryBuilder("cc")
        .where("cc.name = :name", { name: dto.name })
        .andWhere("cc.workshop_id = :workshop_id", {
          workshop_id: dto.workshop_id,
        })
        .andWhere("cc.id != :id", { id })
        .getOne();

      if (existing) {
        throw new BadRequestException(
          `Центр затрат "${dto.name}" уже существует в этом цехе`,
        );
      }
    }

    await this.costCenterRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.costCenterRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Центр затрат с ID ${id} не найден`);
    }
  }
}
