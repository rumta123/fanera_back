// src/product-categories/entities/product-category.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("product_categories")
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string; // Например: «Сырьё», «Полуфабрикат», «Готовая продукция»
}
