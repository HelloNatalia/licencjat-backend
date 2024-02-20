import { Body, Controller, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/createProductDto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('create')
  createProduct(@Body() createProductDto: CreateProductDto): Promise<void> {
    return this.productService.createProduct(createProductDto);
  }
}
