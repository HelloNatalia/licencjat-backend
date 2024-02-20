import { Body, Controller, Post } from '@nestjs/common';
import { ProductCategoryService } from './product_category.service';
import { CreateProductCategoryDto } from './dto/createProductCategoryDto';

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
}
