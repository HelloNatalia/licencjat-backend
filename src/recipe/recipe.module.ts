import { Module } from '@nestjs/common';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './recipe.entity';
import { RecipeCategory } from './recipe-category.entity';
import { RecipeProduct } from './recipe-product.entity';
import { Product } from 'src/product/product.entity';
import { FavouriteRecipe } from './favourite-recipe.entity';
import { TemporaryRecipe } from './temporary-recipe.entity';
import { TemporaryRecipeProduct } from './temporary-recipe-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recipe]),
    TypeOrmModule.forFeature([RecipeCategory]),
    TypeOrmModule.forFeature([RecipeProduct]),
    TypeOrmModule.forFeature([Product]),
    TypeOrmModule.forFeature([FavouriteRecipe]),
    TypeOrmModule.forFeature([TemporaryRecipe]),
    TypeOrmModule.forFeature([TemporaryRecipeProduct]),
  ],
  controllers: [RecipeController],
  providers: [RecipeService],
})
export class RecipeModule {}
