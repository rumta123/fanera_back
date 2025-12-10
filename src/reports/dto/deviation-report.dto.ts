// src/reports/dto/deviation-report.dto.ts
export class DeviationItemDto {
  input_product_id: number;
  input_product_name: string;
  input_product_unit: string;
  norm_quantity: number; // по норме на всю партию
  actual_quantity: number; // фактически израсходовано
  deviation_abs: number; // отклонение в единицах
  deviation_pct: number; // отклонение в %
  deviation_reason?: string; // из BatchFact
}

export class DeviationReportDto {
  batch_id: number;
  product_name: string;
  planned_quantity: number;
  workshop_name: string;
  items: DeviationItemDto[];
}
