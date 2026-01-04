// src/batch-facts/batch-facts.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BatchFact } from "./batch-fact.entity";
import { CreateBatchFactDto, UpdateBatchFactDto } from "./dto/batch-fact.dto";
import { ProductionBatchesService } from "../production-batches/production-batches.service";
import { ProductsService } from "../products/products.service";

@Injectable()
export class BatchFactsService {
  constructor(
    @InjectRepository(BatchFact)
    private factRepo: Repository<BatchFact>,
    private batchesService: ProductionBatchesService,
    private productsService: ProductsService,
  ) {}

  findAll(): Promise<BatchFact[]> {
    return this.factRepo.find();
  }

  async findOne(id: number): Promise<BatchFact> {
    const fact = await this.factRepo.findOneBy({ id });
    if (!fact) throw new NotFoundException(`Факт расхода с ID ${id} не найден`);
    return fact;
  }

  // src/batch-facts/batch-facts.service.ts

  async create(dto: CreateBatchFactDto): Promise<BatchFact> {
    await this.batchesService.findOne(dto.batch_id);
    await this.productsService.findOne(dto.product_id);

    const fact = this.factRepo.create(dto);
    const savedFact = await this.factRepo.save(fact);

    // 👇 Пересчитываем себестоимость после создания
    await this.batchesService.recalculateActualCost(dto.batch_id);

    return savedFact;
  }

  async update(id: number, dto: UpdateBatchFactDto): Promise<BatchFact> {
    const fact = await this.findOne(id); // используем существующий метод для получения старых данных

    if ("batch_id" in dto && dto.batch_id) {
      await this.batchesService.findOne(dto.batch_id);
    }
    if ("product_id" in dto && dto.product_id) {
      await this.productsService.findOne(dto.product_id);
    }

    await this.factRepo.update(id, dto);
    const updatedFact = await this.findOne(id);

    // 👇 Пересчитываем себестоимость
    // Используем новый batch_id, если он был изменён, иначе — старый
    const targetBatchId =
      "batch_id" in dto && dto.batch_id ? dto.batch_id : fact.batch_id;
    await this.batchesService.recalculateActualCost(targetBatchId);

    return updatedFact;
  }

  async remove(id: number): Promise<void> {
    const fact = await this.findOne(id); // получаем данные до удаления

    const result = await this.factRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Факт расхода с ID ${id} не найден`);
    }

    // 👇 Пересчитываем себестоимость после удаления
    await this.batchesService.recalculateActualCost(fact.batch_id);
  }

  // Опционально: получить все факты по партии
  findByBatchId(batch_id: number): Promise<BatchFact[]> {
    return this.factRepo.findBy({ batch_id });
  }
}
