// src/products/entities/product.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ProductCategory } from "../product-categories/product-category.entity";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ unique: true })
  sku: string; // Артикул

  @Column()
  category_id: number;

  // Связь с категорией (для удобства JOIN, если нужно)
  @ManyToOne(() => ProductCategory)
  @JoinColumn({ name: "category_id" })
  category: ProductCategory;

  @Column({ nullable: true })
  sort: string; // 'A', 'C', 'II/III' — может быть null для сырья

  @Column({ type: "float", nullable: true })
  thickness_mm: number; // в миллиметрах

  @Column({ nullable: true })
  dimensions: string; // '1525×1525×12'

  @Column()
  unit: string; // 'м³', 'кг', 'лист'

  // ⬇️ НОВОЕ ПОЛЕ: себестоимость единицы измерения (руб/м³, руб/кг, руб/лист)
  // @Column({ type: "float", nullable: true })
  // cost: number | null; // можно оставить null — тогда материал не учитывается в расчёте
  @Column({ type: "float", nullable: true, name: "cost_per_unit" })
  cost_per_unit: number | null;
}
