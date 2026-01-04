// src/overhead-allocations/overhead-allocations.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OverheadAllocation } from "./overhead-allocation.entity";
import {
  CreateOverheadAllocationDto,
  UpdateOverheadAllocationDto,
} from "./dto/overhead-allocation.dto";
import { ProductionBatchesService } from "../production-batches/production-batches.service";
import { CostCentersService } from "../cost-centers/cost-centers.service";

@Injectable()
export class OverheadAllocationsService {
  constructor(
    @InjectRepository(OverheadAllocation)
    private allocationRepo: Repository<OverheadAllocation>,
    private batchesService: ProductionBatchesService,
    private costCentersService: CostCentersService,
  ) {}

  findAll(): Promise<OverheadAllocation[]> {
    return this.allocationRepo.find();
  }

  async findOne(id: number): Promise<OverheadAllocation> {
    const allocation = await this.allocationRepo.findOneBy({ id });
    if (!allocation) {
      throw new NotFoundException(`Распределение с ID ${id} не найдено`);
    }
    return allocation;
  }

  async create(dto: CreateOverheadAllocationDto): Promise<OverheadAllocation> {
    // Проверяем существование связанных сущностей
    await this.batchesService.findOne(dto.batch_id);
    await this.costCentersService.findOne(dto.cost_center_id);

    const allocation = this.allocationRepo.create(dto);
    return this.allocationRepo.save(allocation);
  }

  async update(
    id: number,
    dto: UpdateOverheadAllocationDto,
  ): Promise<OverheadAllocation> {
    const exists = await this.allocationRepo.existsBy({ id });
    if (!exists) {
      throw new NotFoundException(`Распределение с ID ${id} не найдено`);
    }

    if ("batch_id" in dto && dto.batch_id)
      await this.batchesService.findOne(dto.batch_id);
    if ("cost_center_id" in dto && dto.cost_center_id)
      await this.costCentersService.findOne(dto.cost_center_id);

    await this.allocationRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const allocation = await this.allocationRepo.findOneBy({ id });
    await this.allocationRepo.delete(id);

    if (allocation) {
      // 🔥 ДОБАВЬТЕ ЭТУ СТРОКУ:
      await this.batchesService.recalculateActualCost(allocation.batch_id);
    }
  }

  // Удобный метод: получить все распределения по партии
  findByBatchId(batch_id: number): Promise<OverheadAllocation[]> {
    return this.allocationRepo.findBy({ batch_id });
  }
}
