import { Module } from '@nestjs/common';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './recipe.entity';
import { RecipeCategory } from './recipe-category.entity';
import { RecipeProduct } from './recipe-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recipe]),
    TypeOrmModule.forFeature([RecipeCategory]),
    TypeOrmModule.forFeature([RecipeProduct]),
  ],
  controllers: [RecipeController],
  providers: [RecipeService],
})
export class RecipeModule {}
