// src/products/products.module.ts
import { Module, forwardRef } from "@nestjs/common"; // ← добавьте forwardRef
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { ProductCategoriesModule } from "../product-categories/product-categories.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    forwardRef(() => ProductCategoriesModule), // ← обернули
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
