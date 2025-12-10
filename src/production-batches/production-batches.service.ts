// src/production-batches/production-batches.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductionBatch } from "./production-batch.entity";
import {
  CreateProductionBatchDto,
  UpdateProductionBatchDto,
} from "./dto/production-batch.dto";
import { ProductsService } from "../products/products.service";
import { WorkshopService } from "../workshops/workshops.service";

@Injectable()
export class ProductionBatchesService {
  constructor(
    @InjectRepository(ProductionBatch)
    private batchRepo: Repository<ProductionBatch>,
    private productsService: ProductsService,
    private workshopService: WorkshopService,
  ) {}

  findAll(): Promise<ProductionBatch[]> {
    return this.batchRepo.find();
  }

  getCostVariance(batch: ProductionBatch): {
    variance: number | null;
    isProfit: boolean | null;
  } {
    if (batch.planned_cost == null || batch.actual_cost == null) {
      return { variance: null, isProfit: null };
    }
    const variance = Number(batch.actual_cost) - Number(batch.planned_cost);
    return {
      variance,
      isProfit: variance < 0, // true = "в плюс", false = "в минус"
    };
  }
  async findOne(id: number): Promise<ProductionBatch> {
    const batch = await this.batchRepo.findOneBy({ id });
    if (!batch) throw new NotFoundException(`Партия с ID ${id} не найдена`);
    return batch;
  }

  async create(dto: CreateProductionBatchDto): Promise<ProductionBatch> {
    await this.productsService.findOne(dto.product_id);
    await this.workshopService.findOne(dto.workshop_id);

    if (new Date(dto.end_date) < new Date(dto.start_date)) {
      throw new BadRequestException("end_date не может быть раньше start_date");
    }

    const batch = this.batchRepo.create(dto);
    return this.batchRepo.save(batch);
  }

  async update(
    id: number,
    dto: UpdateProductionBatchDto,
  ): Promise<ProductionBatch> {
    const exists = await this.batchRepo.existsBy({ id });
    if (!exists) {
      throw new NotFoundException(`Партия с ID ${id} не найдена`);
    }

    if ("product_id" in dto && dto.product_id)
      await this.productsService.findOne(dto.product_id);
    if ("workshop_id" in dto && dto.workshop_id)
      await this.workshopService.findOne(dto.workshop_id);

    if (dto.start_date && dto.end_date) {
      if (new Date(dto.end_date) < new Date(dto.start_date)) {
        throw new BadRequestException(
          "end_date не может быть раньше start_date",
        );
      }
    }

    await this.batchRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.batchRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Партия с ID ${id} не найдена`);
    }
  }
}
