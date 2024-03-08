import { Body, Controller, Post } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeCategoryDto } from './dto/createRecipeCategoryDto';

@Controller('recipe')
export class RecipeController {
  constructor(private recipeService: RecipeService) {}

  @Post('create-recipe-category')
  createRecipeCategory(
    @Body() createRecipeCategoryDto: CreateRecipeCategoryDto,
  ): Promise<void> {
    return this.recipeService.createRecipeCategory(createRecipeCategoryDto);
  }
}
