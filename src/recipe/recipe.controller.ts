import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeCategoryDto } from './dto/createRecipeCategoryDto';
import { CreateRecipeDto } from './dto/createRecipeDto';
import { Recipe } from './recipe.entity';
import { RecipeProduct } from './recipe-product.entity';
import { FilterRecipesDto } from './dto/filterRecipesDto';
import { RecipeCategory } from './recipe-category.entity';

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

  @Post()
  getRecipes(@Body() FilterRecipesDto: FilterRecipesDto): Promise<any[]> {
    return this.recipeService.getRecipes(FilterRecipesDto);
  }

  @Get('recipes-categories')
  getRecipesCaregories(): Promise<RecipeCategory[]> {
    return this.recipeService.getRecipesCategories();
  }

  @Get(':id')
  getSpecificRecipe(@Param('id') id: string): Promise<RecipeProduct[]> {
    return this.recipeService.getSpecificRecipe(id);
  }

  @Get('only-recipe/:id')
  getOnlyRecipeData(@Param('id') id: string): Promise<Recipe> {
    return this.recipeService.getOnlyRecipeData(id);
  }
}
