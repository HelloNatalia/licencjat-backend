import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/createProductDto';
import { Product } from './product.entity';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('create')
  createProduct(@Body() createProductDto: CreateProductDto): Promise<void> {
    return this.productService.createProduct(createProductDto);
  }

  @Get('product-list')
  getProductsList(): Promise<Product[]> {
    return this.productService.getProductsList();
  }
}
