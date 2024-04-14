import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from 'src/product/product.entity';
import { TemporaryRecipe } from './temporary-recipe.entity';

@Entity()
export class TemporaryRecipeProduct {
  @PrimaryGeneratedColumn('uuid')
  id_temporary_recipe_product: string;

  @ManyToOne(
    () => TemporaryRecipe,
    (temporary_recipe) => temporary_recipe.temporary_recipe_product,
  )
  temporary_recipe: TemporaryRecipe;

  @ManyToOne(() => Product, (product) => product.recipe_product)
  product: Product;

  @Column()
  amount: string;
}
