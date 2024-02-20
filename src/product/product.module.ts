import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from 'src/product_category/product_category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    TypeOrmModule.forFeature([ProductCategory]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
