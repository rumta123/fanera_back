// src/cost-calculation/cost-calculation.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductionBatch } from "../production-batches/production-batch.entity";
import { BatchFact } from "../batch-facts/batch-fact.entity";
import { OverheadAllocation } from "../overhead-allocations/overhead-allocation.entity";
import { Product } from "../products/product.entity";
import { CostCenter } from "../cost-centers/cost-center.entity";
import {
  CostCalculationReportDto,
  CostMaterialItemDto,
  CostOverheadItemDto,
} from "./dto/cost-calculation.dto";

@Injectable()
export class CostCalculationService {
  constructor(
    @InjectRepository(ProductionBatch)
    private batchRepo: Repository<ProductionBatch>,
    @InjectRepository(BatchFact)
    private factRepo: Repository<BatchFact>,
    @InjectRepository(OverheadAllocation)
    private overheadRepo: Repository<OverheadAllocation>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(CostCenter)
    private costCenterRepo: Repository<CostCenter>,
  ) {}

  async calculateBatchCost(
    batch_id: number,
  ): Promise<CostCalculationReportDto> {
    // 1. Загружаем партию
    const batch = await this.batchRepo.findOneBy({ id: batch_id });
    if (!batch) throw new NotFoundException("Партия не найдена");

    const product = await this.productRepo.findOneBy({ id: batch.product_id });
    if (!product) throw new NotFoundException("Готовая продукция не найдена");

    // 2. Загружаем фактический расход материалов
    const facts = await this.factRepo.findBy({ batch_id });
    const materials: CostMaterialItemDto[] = [];
    let totalMaterialCost = 0;

    for (const fact of facts) {
      const inputProduct = await this.productRepo.findOneBy({
        id: fact.product_id,
      });
      if (!inputProduct || inputProduct.cost == null) continue; // пропускаем без цены

      const total = fact.actual_quantity * inputProduct.cost;
      totalMaterialCost += total;

      materials.push({
        product_id: fact.product_id,
        product_name: inputProduct.name,
        unit: inputProduct.unit,
        quantity: fact.actual_quantity,
        unit_cost: inputProduct.cost,
        total_cost: parseFloat(total.toFixed(2)),
      });
    }

    // 3. Загружаем накладные расходы
    const overheadsRaw = await this.overheadRepo.findBy({ batch_id });
    const overheads: CostOverheadItemDto[] = [];
    let totalOverheadCost = 0;

    for (const oh of overheadsRaw) {
      const cc = await this.costCenterRepo.findOneBy({ id: oh.cost_center_id });
      totalOverheadCost += oh.allocated_amount;
      overheads.push({
        cost_center_id: oh.cost_center_id,
        cost_center_name: cc?.name || "Неизвестно",
        amount: parseFloat(oh.allocated_amount.toFixed(2)),
      });
    }

    // 4. Считаем итоги
    const totalCost = totalMaterialCost + totalOverheadCost;
    const quantity = batch.actual_quantity ?? batch.planned_quantity;
    const costPerUnit = quantity > 0 ? totalCost / quantity : 0;

    return {
      batch_id: batch.id,
      product_name: product.name,
      planned_quantity: batch.planned_quantity,
      actual_quantity: batch.actual_quantity,
      total_material_cost: parseFloat(totalMaterialCost.toFixed(2)),
      total_overhead_cost: parseFloat(totalOverheadCost.toFixed(2)),
      total_cost: parseFloat(totalCost.toFixed(2)),
      cost_per_unit: parseFloat(costPerUnit.toFixed(2)),
      materials,
      overheads,
    };
  }
}
