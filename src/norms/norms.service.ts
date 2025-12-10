// src/norms/norms.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Norm } from "./norm.entity";
import { CreateNormDto, UpdateNormDto } from "./dto/norm.dto";

// Сервисы для проверки внешних ключей
import { ProductsService } from "../products/products.service";
import { WorkshopService } from "../workshops/workshops.service";

@Injectable()
export class NormsService {
  constructor(
    @InjectRepository(Norm)
    private normRepo: Repository<Norm>,
    private productsService: ProductsService,
    private workshopService: WorkshopService,
  ) {}

  findAll(): Promise<Norm[]> {
    return this.normRepo.find();
  }

  async findOne(id: number): Promise<Norm> {
    const norm = await this.normRepo.findOneBy({ id });
    if (!norm) throw new NotFoundException(`Норматив с ID ${id} не найден`);
    return norm;
  }

  async create(dto: CreateNormDto): Promise<Norm> {
    // Проверяем существование всех связанных сущностей
    await this.productsService.findOne(dto.product_id); // финальный продукт
    await this.productsService.findOne(dto.input_product_id); // сырьё
    await this.workshopService.findOne(dto.workshop_id);

    // Проверка логики периода
    if (new Date(dto.period_end) < new Date(dto.period_start)) {
      throw new BadRequestException(
        "period_end не может быть раньше period_start",
      );
    }

    const norm = this.normRepo.create(dto);
    return this.normRepo.save(norm);
  }

  async update(id: number, dto: UpdateNormDto): Promise<Norm> {
    // Проверяем, что запись существует
    const exists = await this.normRepo.existsBy({ id });
    if (!exists) {
      throw new NotFoundException(`Норматив с ID ${id} не найден`);
    }

    // Проверяем внешние ключи (если переданы)
    if ("product_id" in dto) await this.productsService.findOne(dto.product_id);
    if ("input_product_id" in dto)
      await this.productsService.findOne(dto.input_product_id);
    if ("workshop_id" in dto)
      await this.workshopService.findOne(dto.workshop_id);

    // Проверка периода
    if (dto.period_start && dto.period_end) {
      if (new Date(dto.period_end) < new Date(dto.period_start)) {
        throw new BadRequestException(
          "period_end не может быть раньше period_start",
        );
      }
    }

    await this.normRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.normRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Норматив с ID ${id} не найден`);
    }
  }

  // Опционально: получить нормы для продукта в заданный период и цех
  async findActiveNorms(
    product_id: number,
    workshop_id: number,
    date: string, // 'YYYY-MM-DD'
  ): Promise<Norm[]> {
    return this.normRepo
      .createQueryBuilder("norm")
      .where("norm.product_id = :product_id", { product_id })
      .andWhere("norm.workshop_id = :workshop_id", { workshop_id })
      .andWhere("norm.period_start <= :date", { date })
      .andWhere("norm.period_end >= :date", { date })
      .getMany();
  }
}
