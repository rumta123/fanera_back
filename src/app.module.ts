import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { RolesModule } from "./roles/roles.module";
import { AuditLogsModule } from "./audit-logs/audit-logs.module";
import { ProductCategoriesModule } from "./product-categories/product-categories.module";
import { UserWorkshopModule } from "./user-workshops/user-workshop.module";
import { ProductsModule } from "./products/products.module";
import { NormsModule } from "./norms/norms.module";
import { ProductionBatchesModule } from "./production-batches/production-batches.module";
import { BatchFactsModule } from "./batch-facts/batch-facts.module";
import { CostCentersModule } from "./cost-centers/cost-centers.module";
import { OverheadAllocationsModule } from "./overhead-allocations/overhead-allocations.module";
import { CostCalculationModule } from "./cost-calculation/cost-calculation.module";
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "12345",
      database: "fanera_db",
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    AuditLogsModule,
    ProductCategoriesModule,
    UserWorkshopModule,
    ProductsModule,
    NormsModule,
    BatchFactsModule,
    ProductionBatchesModule,
    OverheadAllocationsModule,
    CostCentersModule,
    CostCalculationModule,
    RolesModule, // 🔹 RolesService доступен через импорт модуля
  ],
})
export class AppModule {}
