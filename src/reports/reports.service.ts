// src/reports/reports.service.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductionBatch } from "../production-batches/production-batch.entity";
import { BatchFact } from "../batch-facts/batch-fact.entity";
import { Norm } from "../norms/norm.entity";
import { Product } from "../products/product.entity";
import { Workshop } from "../workshops/workshop.entity";
import {
  DeviationReportDto,
  DeviationItemDto,
} from "./dto/deviation-report.dto";

@Injectable() // ← только один раз!
export class ReportsService {
  constructor(
    @InjectRepository(ProductionBatch)
    private batchRepo: Repository<ProductionBatch>,

    @InjectRepository(BatchFact)
    private factRepo: Repository<BatchFact>,

    @InjectRepository(Norm)
    private normRepo: Repository<Norm>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    @InjectRepository(Workshop)
    private workshopRepo: Repository<Workshop>,
  ) {} // ← конец конструктора

  // ↓ Метод ВНУТРИ класса
  async generateDeviationReport(batch_id: number): Promise<DeviationReportDto> {
    // 1. Загружаем партию
    const batch = await this.batchRepo.findOneBy({ id: batch_id });
    if (!batch) throw new Error("Партия не найдена");

    // 2. Загружаем связанные сущности для заголовка
    const [product, workshop] = await Promise.all([
      this.productRepo.findOneBy({ id: batch.product_id }),
      this.workshopRepo.findOneBy({ id: batch.workshop_id }),
    ]);

    // 3. Находим середину периода партии для поиска норм
    const startDate = new Date(batch.start_date);
    const endDate = new Date(batch.end_date);
    const midDate = new Date((startDate.getTime() + endDate.getTime()) / 2);
    const reportDate = midDate.toISOString().split("T")[0]; // 'YYYY-MM-DD'

    // 4. Загружаем все факты по партии
    const facts = await this.factRepo.findBy({ batch_id });

    // 5. Для каждого факта находим норму и считаем отклонение
    const items: DeviationItemDto[] = [];

    for (const fact of facts) {
      const inputProduct = await this.productRepo.findOneBy({
        id: fact.product_id,
      });
      if (!inputProduct) continue;

      // Ищем активную норму на дату партии
      const norm = await this.normRepo
        .createQueryBuilder("norm")
        .where("norm.product_id = :finalProductId", {
          finalProductId: batch.product_id,
        })
        .andWhere("norm.input_product_id = :inputProductId", {
          inputProductId: fact.product_id,
        })
        .andWhere("norm.workshop_id = :workshopId", {
          workshopId: batch.workshop_id,
        })
        .andWhere("norm.period_start <= :date", { date: reportDate })
        .andWhere("norm.period_end >= :date", { date: reportDate })
        .getOne();

      let norm_quantity = 0;
      if (norm) {
        norm_quantity = batch.planned_quantity * norm.quantity_per_unit;
      }

      const deviation_abs = fact.actual_quantity - norm_quantity;
      const deviation_pct =
        norm_quantity > 0 ? (deviation_abs / norm_quantity) * 100 : 0;

      items.push({
        input_product_id: fact.product_id,
        input_product_name: inputProduct.name,
        input_product_unit: inputProduct.unit,
        norm_quantity: parseFloat(norm_quantity.toFixed(4)),
        actual_quantity: fact.actual_quantity,
        deviation_abs: parseFloat(deviation_abs.toFixed(4)),
        deviation_pct: parseFloat(deviation_pct.toFixed(2)),
        deviation_reason: fact.deviation_reason || undefined,
      });
    }

    return {
      batch_id: batch.id,
      product_name: product?.name || "Неизвестно",
      planned_quantity: batch.planned_quantity,
      workshop_name: workshop?.name || "Неизвестно",
      items,
    };
  } // ← конец метода
} // ← конец класса
