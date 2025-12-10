// src/products/products.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./product.entity";
import { CreateProductDto, UpdateProductDto } from "./dto/product.dto";
import { ProductCategoriesService } from "../product-categories/product-categories.service";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    @Inject(forwardRef(() => ProductCategoriesService))
    private categoryService: ProductCategoriesService,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productRepo.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Продукт с ID ${id} не найден`);
    }
    return product;
  }

  async findByCategoryId(category_id: number): Promise<Product[]> {
    return this.productRepo.findBy({ category_id });
  }
  async create(dto: CreateProductDto): Promise<Product> {
    // Проверяем, что категория существует
    await this.categoryService.findOne(dto.category_id);

    const existing = await this.productRepo.findOneBy({ sku: dto.sku });
    if (existing) {
      throw new BadRequestException(`Артикул "${dto.sku}" уже существует`);
    }

    const product = this.productRepo.create(dto);
    return this.productRepo.save(product);
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const existing = await this.productRepo.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException(`Продукт с ID ${id} не найден`);
    }

    // Если меняется категория — проверяем её существование
    if (dto.category_id && dto.category_id !== existing.category_id) {
      await this.categoryService.findOne(dto.category_id);
    }

    // Проверка уникальности SKU (если меняется)
    if (dto.sku && dto.sku !== existing.sku) {
      const skuExists = await this.productRepo.findOneBy({ sku: dto.sku });
      if (skuExists) {
        throw new BadRequestException(`Артикул "${dto.sku}" уже существует`);
      }
    }

    await this.productRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.productRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Продукт с ID ${id} не найден`);
    }
  }
}
