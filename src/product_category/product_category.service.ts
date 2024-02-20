import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategory } from './product_category.entity';
import { Repository } from 'typeorm';
import { CreateProductCategoryDto } from './dto/createProductCategoryDto';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private productCategoriesRepository: Repository<ProductCategory>,
  ) {}

  async createProductCategory(
    createProductCategoryDto: CreateProductCategoryDto,
  ): Promise<void> {
    const { name, description } = createProductCategoryDto;

    const db_category = await this.productCategoriesRepository.findOneBy({
      name,
    });

    if (db_category != null) {
      throw new ConflictException('Category with this name already exists');
    }

    const category = this.productCategoriesRepository.create({
      name,
      description,
    });

    try {
      this.productCategoriesRepository.save(category);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getCategoriesList(): Promise<ProductCategory[]> {
    const categories = await this.productCategoriesRepository.find();
    return categories;
  }
}
