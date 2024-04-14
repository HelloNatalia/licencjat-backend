import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipe } from './recipe.entity';
import { Repository } from 'typeorm';
import { RecipeCategory } from './recipe-category.entity';
import { RecipeProduct } from './recipe-product.entity';
import { CreateRecipeCategoryDto } from './dto/createRecipeCategoryDto';
import { CreateRecipeDto } from './dto/createRecipeDto';
import { Product } from 'src/product/product.entity';
import { FilterRecipesDto } from './dto/filterRecipesDto';
import { AddToFavouriteDto } from './dto/addToFavouriteDto';
import { User } from 'src/auth/user.entity';
import { FavouriteRecipe } from './favourite-recipe.entity';
import { TemporaryRecipe } from './temporary-recipe.entity';
import { TemporaryRecipeProduct } from './temporary-recipe-product.entity';
import { RecipeStatus } from './recipe-status.enum';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,

    @InjectRepository(RecipeCategory)
    private recipeCategoryRepository: Repository<RecipeCategory>,

    @InjectRepository(RecipeProduct)
    private recipeProductRepository: Repository<RecipeProduct>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(FavouriteRecipe)
    private favouriteRecipeRepository: Repository<FavouriteRecipe>,

    @InjectRepository(TemporaryRecipe)
    private temporaryRecipeRepository: Repository<TemporaryRecipe>,

    @InjectRepository(TemporaryRecipeProduct)
    private temporaryRecipeProductRepository: Repository<TemporaryRecipeProduct>,
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

  async createRecipe(createRecipeDto: CreateRecipeDto): Promise<void> {
    const {
      title,
      text,
      photos,
      id_recipe_category,
      list_id_products,
      list_amount,
    } = createRecipeDto;

    const recipeCategory = await this.recipeCategoryRepository.findOneBy({
      id_recipe_category,
    });

    if (!recipeCategory) {
      throw new NotFoundException('Recipe category not found');
    }

    const listProducts: Product[] = [];
    list_id_products.map(async (element: string) => {
      const product = await this.productRepository.findOneBy({
        id_product: element,
      });
      if (product) {
        listProducts.push(product);
      }
    });

    const recipe = this.recipeRepository.create({
      title,
      text,
      photos,
      recipe_category: recipeCategory,
    });

    try {
      await this.recipeRepository.save(recipe);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Something went wrong');
    }

    listProducts.map(async (element) => {
      let product_amount = '';
      const foundAmount = list_amount.find(
        (amount) => amount.id === element.id_product,
      );
      if (foundAmount) {
        product_amount = foundAmount.amount;
      }

      const recipeProduct = this.recipeProductRepository.create({
        recipe,
        product: element,
        amount: product_amount,
      });
      try {
        await this.recipeProductRepository.save(recipeProduct);
      } catch (error) {
        console.log(error.message);
        throw new InternalServerErrorException('Something went wrong');
      }
    });
  }

  async createTemporaryRecipe(
    createRecipeDto: CreateRecipeDto,
    user: User,
  ): Promise<void> {
    const {
      title,
      text,
      photos,
      id_recipe_category,
      list_id_products,
      list_amount,
    } = createRecipeDto;

    const recipeCategory = await this.recipeCategoryRepository.findOneBy({
      id_recipe_category,
    });

    if (!recipeCategory) {
      throw new NotFoundException('Recipe category not found');
    }

    const listProducts: Product[] = [];
    list_id_products.map(async (element: string) => {
      const product = await this.productRepository.findOneBy({
        id_product: element,
      });
      if (product) {
        listProducts.push(product);
      }
    });

    const temporaryRecipe = this.temporaryRecipeRepository.create({
      user,
      title,
      text,
      photos,
      recipe_category: recipeCategory,
    });

    try {
      await this.temporaryRecipeRepository.save(temporaryRecipe);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Something went wrong');
    }

    listProducts.map(async (element) => {
      let product_amount = '';
      const foundAmount = list_amount.find(
        (amount) => amount.id === element.id_product,
      );
      if (foundAmount) {
        product_amount = foundAmount.amount;
      }
      const temporaryRecipeProduct =
        this.temporaryRecipeProductRepository.create({
          temporary_recipe: temporaryRecipe,
          product: element,
          amount: product_amount,
        });
      try {
        await this.temporaryRecipeProductRepository.save(
          temporaryRecipeProduct,
        );
      } catch (error) {
        console.log(error.message);
        throw new InternalServerErrorException('Something went wrong');
      }
    });
  }

  async getAllRecipes(id_recipe_category: string): Promise<RecipeProduct[]> {
    if (id_recipe_category) {
      const recipeCategory = await this.recipeCategoryRepository.findOneBy({
        id_recipe_category,
      });
      if (!recipeCategory) {
        throw new NotFoundException('Selected category not found');
      }
      const recipes = await this.recipeProductRepository.find({
        where: { recipe: { recipe_category: recipeCategory } },
        relations: ['recipe', 'product'],
      });
      return recipes;
    }
    const recipes = this.recipeProductRepository.find({
      where: {},
      relations: ['recipe', 'product'],
    });
    return recipes;
  }

  async getAllRecipesAdminPage(): Promise<Recipe[]> {
    const recipes = this.recipeRepository.find();
    return recipes;
  }

  async getRecipes(filterRecipesDto: FilterRecipesDto): Promise<any[]> {
    const { products_list, id_recipe_category } = filterRecipesDto;

    if (!products_list || products_list.length === 0) {
      return [];
    }
    const query =
      this.recipeProductRepository.createQueryBuilder('recipe_product');
    query.leftJoinAndSelect('recipe_product.recipe', 'recipe');
    query.leftJoinAndSelect('recipe_product.product', 'product');

    if (id_recipe_category) {
      query.andWhere(
        '(recipe.recipeCategoryIdRecipeCategory = :id_recipe_category)',
        {
          id_recipe_category,
        },
      );
    }

    if (products_list && products_list.length > 0) {
      query.andWhere('recipe_product.productIdProduct IN (:...products_list)', {
        products_list,
      });
    }

    const records = await query.getMany();

    const updatedRecords: any[] = [];
    for (const element of records) {
      const existed = updatedRecords.find(
        (record) => record.id_recipe === element.recipe.id_recipe,
      );

      if (existed !== undefined) {
        const total: number = existed.all_products;
        existed.have += 1;
        const have: number = existed.have;
        let missing: number = total - have;
        if (Number.isNaN(missing)) missing = 0;
        existed.missing = missing;
      } else {
        const products_db = await this.recipeProductRepository.find({
          where: {
            recipe: element.recipe,
          },
          relations: ['recipe', 'product'],
        });
        const productsArray: string[] = [];
        products_db.map((prod) => {
          productsArray.push(prod.product.id_product);
        });
        const total: number = productsArray.length;
        const have: number = 1;
        let missing: number = total - have;
        if (Number.isNaN(missing)) missing = 0;

        updatedRecords.push({
          id_recipe: element.recipe.id_recipe,
          title: element.recipe.title,
          text: element.recipe.text,
          photos: element.recipe.photos,
          products: productsArray,
          total: total,
          have: have,
          missing: missing,
        });
      }
    }

    return updatedRecords;
  }

  async getRecipesCategories(): Promise<RecipeCategory[]> {
    const categories = await this.recipeCategoryRepository.find();

    return categories;
  }

  async getSpecificRecipe(id: string): Promise<RecipeProduct[]> {
    let recipe;
    try {
      recipe = await this.recipeRepository.findOneBy({ id_recipe: id });
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Something went wrong');
    }
    if (!recipe) {
      throw new NotFoundException('Selected recipe not found');
    }
    const recipeProduct = await this.recipeProductRepository.find({
      where: { recipe },
      relations: ['recipe', 'product'],
    });
    if (!recipeProduct) {
      throw new NotFoundException('Selected recipe not found');
    }
    return recipeProduct;
  }

  async getOnlyRecipeData(id: string): Promise<Recipe> {
    let recipe;
    try {
      recipe = await this.recipeRepository.findOne({
        where: { id_recipe: id },
        relations: ['recipe_category'],
      });
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Something went wrong');
    }
    if (!recipe) {
      throw new NotFoundException('Selected recipe not found');
    }
    return recipe;
  }

  async addFavouriteRecipe(
    user: User,
    addToFavouriteDto: AddToFavouriteDto,
  ): Promise<void> {
    const { id_recipe } = addToFavouriteDto;

    const recipe = await this.recipeRepository.findOneBy({ id_recipe });
    if (!recipe || !user) {
      throw new NotFoundException('Selected recipe or user not found');
    }

    const favouriteRecipe = this.favouriteRecipeRepository.create({
      user,
      recipe,
    });

    try {
      this.favouriteRecipeRepository.save(favouriteRecipe);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async checkIfFavourite(user: User, id: string): Promise<any> {
    const recipe = await this.recipeRepository.findOneBy({ id_recipe: id });
    if (!recipe) throw new NotFoundException('Selected recipe not found');

    const favourite = await this.favouriteRecipeRepository.findOne({
      where: {
        recipe,
        user,
      },
    });

    if (favourite) return { is_favourite: true };
    else return { is_favourite: false };
  }

  async deleteFavourite(user: User, id: string): Promise<void> {
    const recipe = await this.recipeRepository.findOneBy({ id_recipe: id });
    if (!recipe) throw new NotFoundException('Selected recipe not found');

    const favouriteRecipe = await this.favouriteRecipeRepository.findOne({
      where: {
        user,
        recipe,
      },
    });

    if (!favouriteRecipe)
      throw new NotFoundException('Selected favourite recipe not found');

    try {
      await this.favouriteRecipeRepository.remove(favouriteRecipe);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getFavourites(user: User): Promise<FavouriteRecipe[]> {
    const favourites = await this.favouriteRecipeRepository.find({
      where: {
        user,
      },
      relations: ['recipe'],
    });

    return favourites;
  }

  async getMyRecipePropositions(user: User): Promise<TemporaryRecipe[]> {
    const recipes = await this.temporaryRecipeRepository.find({
      where: {
        user: user,
      },
    });

    return recipes;
  }

  async getAllTemporaryRecipes(): Promise<TemporaryRecipe[]> {
    const recipes = await this.temporaryRecipeRepository.find({
      where: { status: RecipeStatus.Created },
    });
    console.log(recipes);
    return recipes;
  }

  async getTemporaryRecipe(id: string): Promise<TemporaryRecipeProduct[]> {
    const recipe = await this.temporaryRecipeRepository.findOneBy({
      id_temporary_recipe: id,
    });

    if (!recipe) {
      throw new NotFoundException('Selected temporary recipe not found');
    }

    const recipeProducts = await this.temporaryRecipeProductRepository.find({
      where: { temporary_recipe: recipe },
      relations: ['temporary_recipe', 'product'],
    });

    return recipeProducts;
  }

  async acceptTemporaryRecipe(id: string): Promise<void> {
    const temporaryRecipe = await this.temporaryRecipeRepository.findOne({
      where: { id_temporary_recipe: id },
      relations: ['recipe_category'],
    });

    if (!temporaryRecipe) {
      throw new NotFoundException('Selected temporary recipe not found');
    }

    const temporaryRecipeProducts =
      await this.temporaryRecipeProductRepository.find({
        where: { temporary_recipe: temporaryRecipe },
        relations: ['temporary_recipe', 'product'],
      });

    const recipe = this.recipeRepository.create({
      title: temporaryRecipe.title,
      text: temporaryRecipe.text,
      photos: temporaryRecipe.photos,
      recipe_category: temporaryRecipe.recipe_category,
    });
    try {
      await this.recipeRepository.save(recipe);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Something went wrong');
    }

    temporaryRecipeProducts.map(async (element) => {
      const recipeProduct = this.recipeProductRepository.create({
        recipe,
        product: element.product,
        amount: element.amount,
      });
      try {
        await this.recipeProductRepository.save(recipeProduct);
      } catch (error) {
        console.log(error.message);
        throw new InternalServerErrorException('Something went wrong');
      }
    });

    temporaryRecipe.status = RecipeStatus.Accepted;
    try {
      await this.temporaryRecipeRepository.save(temporaryRecipe);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async deleteTemporaryRecipe(id: string): Promise<void> {
    const temporaryRecipe = await this.temporaryRecipeRepository.findOneBy({
      id_temporary_recipe: id,
    });

    if (!temporaryRecipe) {
      throw new NotFoundException('Selected temporary recipe not found');
    }

    const temporaryRecipeProduct =
      await this.temporaryRecipeProductRepository.find({
        where: { temporary_recipe: temporaryRecipe },
      });

    Promise.all(
      temporaryRecipeProduct.map(async (element) => {
        try {
          await this.temporaryRecipeProductRepository.remove(element);
        } catch (error) {
          console.log(error.message);
          throw new InternalServerErrorException('Something went wrong');
        }
      }),
    );

    try {
      await this.temporaryRecipeRepository.remove(temporaryRecipe);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async deleteRecipe(id: string): Promise<void> {
    const recipe = await this.recipeRepository.findOneBy({
      id_recipe: id,
    });

    if (!recipe) {
      throw new NotFoundException('Selected temporary recipe not found');
    }
    try {
      await this.recipeProductRepository.delete({ recipe });

      const favourites = await this.favouriteRecipeRepository.findBy({
        recipe,
      });
      for (const favourite of favourites) {
        await this.favouriteRecipeRepository.remove(favourite);
      }

      await this.recipeRepository.remove(recipe);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async editRecipe(
    id: string,
    createRecipeDto: CreateRecipeDto,
  ): Promise<void> {
    console.log(createRecipeDto.id_recipe_category);
    const { title, text, id_recipe_category, list_id_products, list_amount } =
      createRecipeDto;

    const recipe = await this.recipeRepository.findOneBy({ id_recipe: id });

    if (!recipe) {
      throw new NotFoundException('Selected recipe not found');
    }

    let recipeCategory;
    if (id_recipe_category) {
      recipeCategory = await this.recipeCategoryRepository.findOneBy({
        id_recipe_category,
      });
    } else {
      recipeCategory = recipe.recipe_category;
    }

    if (!recipeCategory) {
      throw new NotFoundException('Recipe category not found');
    }

    const listProducts: Product[] = [];
    await Promise.all(
      list_id_products.map(async (element: string) => {
        const product = await this.productRepository.findOneBy({
          id_product: element,
        });
        if (product) {
          listProducts.push(product);
        }
      }),
    );

    recipe.title = title;
    recipe.text = text;
    recipe.recipe_category = recipeCategory;
    console.log(recipe.photos);
    try {
      await this.recipeRepository.save(recipe);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Something went wrong');
    }

    // Usunąć wszystkie rekordy recipe_product
    const currentRecipeProducts = await this.recipeProductRepository.find({
      where: { recipe: recipe },
    });
    await Promise.all(
      currentRecipeProducts.map(async (element) => {
        await this.recipeProductRepository.remove(element);
      }),
    );

    // let product_amount = '';
    //   const foundAmount = list_amount.find(
    //     (amount) => amount.id === element.id_product,
    //   );
    //   if (foundAmount) {
    //     product_amount = foundAmount.amount;
    //   }
    //   const temporaryRecipeProduct =
    //     this.temporaryRecipeProductRepository.create({
    //       temporary_recipe: temporaryRecipe,
    //       product: element,
    //       amount: product_amount,
    //     });
    await Promise.all(
      listProducts.map(async (element) => {
        let product_amount = '';
        const foundAmount = list_amount.find(
          (amount) => amount.id === element.id_product,
        );
        if (foundAmount) {
          product_amount = foundAmount.amount;
        }
        const recipeProduct = this.recipeProductRepository.create({
          recipe,
          product: element,
          amount: product_amount,
        });
        try {
          await this.recipeProductRepository.save(recipeProduct);
        } catch (error) {
          console.log(error.message);
          throw new InternalServerErrorException('Something went wrong');
        }
      }),
    );
  }

  async deleteAllUsersFavouriteRecipes(user: User): Promise<void> {
    const recipes = await this.favouriteRecipeRepository.findBy({ user });

    for (const recipe of recipes) {
      try {
        await this.favouriteRecipeRepository.remove(recipe);
      } catch (error) {
        console.log(error.message);
        throw new InternalServerErrorException();
      }
    }
  }

  async deleteAllUsersTemporaryRecipes(user: User): Promise<void> {
    const recipes = await this.temporaryRecipeRepository.findBy({ user });

    for (const recipe of recipes) {
      try {
        const products = await this.temporaryRecipeProductRepository.findBy({
          temporary_recipe: recipe,
        });
        for (const product of products) {
          await this.temporaryRecipeProductRepository.remove(product);
        }
        await this.temporaryRecipeRepository.remove(recipe);
      } catch (error) {
        console.log(error.message);
        throw new InternalServerErrorException();
      }
    }
  }
}
