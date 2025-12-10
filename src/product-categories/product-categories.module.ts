// src/product-categories/product-categories.module.ts
import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductCategory } from "./product-category.entity";
import { ProductCategoriesController } from "./product-categories.controller";
import { ProductCategoriesService } from "./product-categories.service";
import { ProductsModule } from "../products/products.module"; // ← импортируем

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductCategory]),
    forwardRef(() => ProductsModule), // ← обернули!
  ],
  controllers: [ProductCategoriesController],
  providers: [ProductCategoriesService],
  exports: [ProductCategoriesService],
})
export class ProductCategoriesModule {}
