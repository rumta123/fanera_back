// src/cost-calculation/cost-calculation.controller.ts
import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { CostCalculationService } from "./cost-calculation.service";
import { CostCalculationReportDto } from "./dto/cost-calculation.dto";

@Controller("api/cost-calculation")
export class CostCalculationController {
  constructor(private service: CostCalculationService) {}

  @Get("batch/:batchId")
  calculateBatchCost(
    @Param("batchId", ParseIntPipe) batchId: number,
  ): Promise<CostCalculationReportDto> {
    return this.service.calculateBatchCost(batchId);
  }
}
