// src/cost-calculation/dto/cost-calculation.dto.ts
export class CostMaterialItemDto {
  product_id: number;
  product_name: string;
  unit: string;
  quantity: number; // фактический расход
  unit_cost: number; // cost из Product
  total_cost: number; // quantity * unit_cost
}

export class CostOverheadItemDto {
  cost_center_id: number;
  cost_center_name: string;
  amount: number; // allocated_amount
}

export class CostCalculationReportDto {
  batch_id: number;
  product_name: string;
  planned_quantity: number;
  actual_quantity: number | null;
  total_material_cost: number;
  total_overhead_cost: number;
  total_cost: number;
  cost_per_unit: number; // total_cost / (actual_quantity || planned_quantity)

  materials: CostMaterialItemDto[];
  overheads: CostOverheadItemDto[];
}
