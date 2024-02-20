import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductCategoryService } from './product_category.service';
import { CreateProductCategoryDto } from './dto/createProductCategoryDto';
import { ProductCategory } from './product_category.entity';

@Controller('product-category')
export class ProductCategoryController {
  constructor(private productCategoryService: ProductCategoryService) {}

  @Post('create')
  createProductCategory(
    @Body() createProductCategoryDto: CreateProductCategoryDto,
  ): Promise<void> {
    return this.productCategoryService.createProductCategory(
      createProductCategoryDto,
    );
  }

  @Get('category-list')
  getCategoriesList(): Promise<ProductCategory[]> {
    return this.productCategoryService.getCategoriesList();
  }
}
