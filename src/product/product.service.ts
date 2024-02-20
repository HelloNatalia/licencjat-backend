import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/createProductDto';
import { ProductCategory } from 'src/product_category/product_category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(ProductCategory)
    private productCategoriesRepository: Repository<ProductCategory>,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<void> {
    const { name, description, product_category_id } = createProductDto;
    const db_product = await this.productsRepository.findOneBy({ name });
    if (db_product != null) {
      throw new ConflictException('Product with this name already exists');
    }

    const categoryObj = await this.productCategoriesRepository.findOneBy({
      id_product_category: product_category_id,
    });
    if (categoryObj == null) {
      throw new NotFoundException("Selected category doesn't exist");
    }

    const product = this.productsRepository.create({
      name,
      description,
      product_category: categoryObj,
    });
    try {
      await this.productsRepository.save(product);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
