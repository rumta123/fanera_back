// src/reports/reports.controller.ts
import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { DeviationReportDto } from "./dto/deviation-report.dto";

@Controller("reports")
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get("deviation/:batchId")
  getDeviationReport(
    @Param("batchId", ParseIntPipe) batchId: number,
  ): Promise<DeviationReportDto> {
    return this.reportsService.generateDeviationReport(batchId);
  }
}
