import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Recipe } from './recipe.entity';
import { Product } from 'src/product/product.entity';

@Entity()
export class RecipeProduct {
  @PrimaryGeneratedColumn('uuid')
  id_recipe_product: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.recipe_product)
  recipe: Recipe;

  @ManyToOne(() => Product, (product) => product.recipe_product)
  product: Product;

  @Column()
  amount: string;
}
