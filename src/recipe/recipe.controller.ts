import { Body, Controller, Get, Post } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeCategoryDto } from './dto/createRecipeCategoryDto';
import { CreateRecipeDto } from './dto/createRecipeDto';
import { Recipe } from './recipe.entity';
import { RecipeProduct } from './recipe-product.entity';
import { FilterRecipesDto } from './dto/filterRecipesDto';

@Controller('recipe')
export class RecipeController {
  constructor(private recipeService: RecipeService) {}

  @Post('create-recipe-category')
  createRecipeCategory(
    @Body() createRecipeCategoryDto: CreateRecipeCategoryDto,
  ): Promise<void> {
    return this.recipeService.createRecipeCategory(createRecipeCategoryDto);
  }

  @Post('create-recipe')
  createRecipe(@Body() createRecipeDto: CreateRecipeDto): Promise<void> {
    return this.recipeService.createRecipe(createRecipeDto);
  }

  @Get('all')
  getAllRecipes(): Promise<RecipeProduct[]> {
    return this.recipeService.getAllRecipes();
  }

  @Get()
  getRecipes(@Body() FilterRecipesDto: FilterRecipesDto): Promise<any[]> {
    return this.recipeService.getRecipes(FilterRecipesDto);
  }
}
