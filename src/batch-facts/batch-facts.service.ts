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

  async create(dto: CreateBatchFactDto): Promise<BatchFact> {
    // Проверяем, что партия и продукт (сырьё) существуют
    await this.batchesService.findOne(dto.batch_id);
    await this.productsService.findOne(dto.product_id);

    const fact = this.factRepo.create(dto);
    return this.factRepo.save(fact);
  }

  async update(id: number, dto: UpdateBatchFactDto): Promise<BatchFact> {
    const exists = await this.factRepo.existsBy({ id });
    if (!exists) {
      throw new NotFoundException(`Факт расхода с ID ${id} не найден`);
    }

    if ("batch_id" in dto && dto.batch_id)
      await this.batchesService.findOne(dto.batch_id);
    if ("product_id" in dto && dto.product_id)
      await this.productsService.findOne(dto.product_id);

    await this.factRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.factRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Факт расхода с ID ${id} не найден`);
    }
  }

  // Опционально: получить все факты по партии
  findByBatchId(batch_id: number): Promise<BatchFact[]> {
    return this.factRepo.findBy({ batch_id });
  }
}
