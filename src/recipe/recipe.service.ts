import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipe } from './recipe.entity';
import { Repository } from 'typeorm';
import { RecipeCategory } from './recipe-category.entity';
import { RecipeProduct } from './recipe-product.entity';
import { CreateRecipeCategoryDto } from './dto/createRecipeCategoryDto';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,

    @InjectRepository(RecipeCategory)
    private recipeCategoryRepository: Repository<RecipeCategory>,

    @InjectRepository(RecipeProduct)
    private recipeProductRepository: Repository<RecipeProduct>,
  ) {}

  async createRecipeCategory(
    createRecipeCategoryDto: CreateRecipeCategoryDto,
  ): Promise<void> {
    const { name, description } = createRecipeCategoryDto;

    const recipeCategory = this.recipeCategoryRepository.create({
      name,
      description,
    });

    try {
      await this.recipeCategoryRepository.save(recipeCategory);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
