import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeCategoryDto } from './dto/createRecipeCategoryDto';
import { CreateRecipeDto } from './dto/createRecipeDto';
import { Recipe } from './recipe.entity';
import { RecipeProduct } from './recipe-product.entity';
import { FilterRecipesDto } from './dto/filterRecipesDto';
import { RecipeCategory } from './recipe-category.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { AddToFavouriteDto } from './dto/addToFavouriteDto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { FavouriteRecipe } from './favourite-recipe.entity';

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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Client)
  @Get('/favourites')
  getFavourites(@GetUser() user: User): Promise<FavouriteRecipe[]> {
    return this.recipeService.getFavourites(user);
  }

  @Get(':id')
  getSpecificRecipe(@Param('id') id: string): Promise<RecipeProduct[]> {
    return this.recipeService.getSpecificRecipe(id);
  }

  @Get('only-recipe/:id')
  getOnlyRecipeData(@Param('id') id: string): Promise<Recipe> {
    return this.recipeService.getOnlyRecipeData(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Client)
  @Post('add-to-favourite')
  addFavouriteRecipe(
    @GetUser() user: User,
    @Body() addToFavouriteDto: AddToFavouriteDto,
  ): Promise<void> {
    console.log(user);
    return this.recipeService.addFavouriteRecipe(user, addToFavouriteDto);
  }

  @Get('is-favourite/:id')
  checkIfFavourite(
    @GetUser() user: User,
    @Param('id') id: string,
  ): Promise<any> {
    return this.recipeService.checkIfFavourite(user, id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Client)
  @Delete('delete-favourite/:id')
  deleteFavourite(
    @GetUser() user: User,
    @Param('id') id: string,
  ): Promise<void> {
    return this.recipeService.deleteFavourite(user, id);
  }
}
