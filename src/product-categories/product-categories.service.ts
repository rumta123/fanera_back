// src/product-categories/product-categories.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductCategory } from "./product-category.entity";
import { ProductsService } from "../products/products.service";
import {
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
} from "./dto/product-category.dto";

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private categoryRepo: Repository<ProductCategory>,

    @Inject(forwardRef(() => ProductsService))
    private productsService: ProductsService,
  ) {}

  findAll(): Promise<ProductCategory[]> {
    return this.categoryRepo.find();
  }

  async findOne(id: number): Promise<ProductCategory> {
    const category = await this.categoryRepo.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Категория с ID ${id} не найдена`);
    }
    return category;
  }

  async create(dto: CreateProductCategoryDto): Promise<ProductCategory> {
    const existing = await this.categoryRepo.findOneBy({ name: dto.name });
    if (existing) {
      throw new BadRequestException(`Категория "${dto.name}" уже существует`);
    }
    const category = this.categoryRepo.create(dto);
    return this.categoryRepo.save(category);
  }

  async update(
    id: number,
    dto: UpdateProductCategoryDto,
  ): Promise<ProductCategory> {
    const existingByName = await this.categoryRepo.findOneBy({
      name: dto.name,
    });
    if (existingByName && existingByName.id !== id) {
      throw new BadRequestException(`Категория "${dto.name}" уже существует`);
    }

    await this.categoryRepo.update(id, dto);
    const updated = await this.findOne(id);
    return updated;
  }

  async remove(id: number): Promise<void> {
    // 🔒 Проверяем, есть ли продукты с этой категорией
    const productsInCategory = await this.productsService.findByCategoryId(id);
    if (productsInCategory.length > 0) {
      throw new BadRequestException(
        `Невозможно удалить категорию: к ней привязано ${productsInCategory.length} товаров. Удалите или переназначьте их сначала.`,
      );
    }

    const result = await this.categoryRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Категория с ID ${id} не найдена`);
    }
  }
}
