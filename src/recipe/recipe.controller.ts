import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import { TemporaryRecipeProduct } from './temporary-recipe-product.entity';
import { TemporaryRecipe } from './temporary-recipe.entity';

@Controller('recipe')
export class RecipeController {
  constructor(private recipeService: RecipeService) {}

  @Post('create-recipe-category')
  createRecipeCategory(
    @Body() createRecipeCategoryDto: CreateRecipeCategoryDto,
  ): Promise<void> {
    return this.recipeService.createRecipeCategory(createRecipeCategoryDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @Post('create-recipe')
  createRecipe(@Body() createRecipeDto: CreateRecipeDto): Promise<void> {
    return this.recipeService.createRecipe(createRecipeDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Client)
  @Post('create-temporary-recipe')
  createTemporaryRecipe(
    @Body() createRecipeDto: CreateRecipeDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.recipeService.createTemporaryRecipe(createRecipeDto, user);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @Get('all-admin-panel')
  getAllRecipesAdminPage(): Promise<Recipe[]> {
    return this.recipeService.getAllRecipesAdminPage();
  }

  @Get('all')
  getAllRecipes(
    @Query('id_recipe_category') id_recipe_category: string,
  ): Promise<RecipeProduct[]> {
    return this.recipeService.getAllRecipes(id_recipe_category);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @Get('all-temporary')
  getAllTemporaryRecipes(): Promise<TemporaryRecipe[]> {
    return this.recipeService.getAllTemporaryRecipes();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Client)
  @Get('temporary/:id')
  getTemporaryRecipe(
    @Param('id') id: string,
  ): Promise<TemporaryRecipeProduct[]> {
    return this.recipeService.getTemporaryRecipe(id);
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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Client)
  @Get('my-recipe-propositions')
  getMyRecipePropositions(@GetUser() user: User): Promise<TemporaryRecipe[]> {
    return this.recipeService.getMyRecipePropositions(user);
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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Client)
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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @Get('accept-recipe/:id')
  acceptTemporaryRecipe(@Param('id') id: string): Promise<void> {
    return this.recipeService.acceptTemporaryRecipe(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @Delete('delete-temporary-recipe/:id')
  deleteTemporaryRecipe(@Param('id') id: string): Promise<void> {
    return this.recipeService.deleteTemporaryRecipe(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @Delete('delete-recipe/:id')
  deleteRecipe(@Param('id') id: string): Promise<void> {
    return this.recipeService.deleteRecipe(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @Patch('edit-recipe/:id')
  editRecipe(
    @Param('id') id: string,
    @Body() createRecipeDto: CreateRecipeDto,
  ): Promise<void> {
    return this.recipeService.editRecipe(id, createRecipeDto);
  }
}
