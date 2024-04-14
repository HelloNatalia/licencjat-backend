import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RecipeCategory } from './recipe-category.entity';
import { RecipeProduct } from './recipe-product.entity';
import { User } from 'src/auth/user.entity';
import { TemporaryRecipeProduct } from './temporary-recipe-product.entity';
import { RecipeStatus } from './recipe-status.enum';

@Entity()
export class TemporaryRecipe {
  @PrimaryGeneratedColumn('uuid')
  id_temporary_recipe: string;

  @ManyToOne(() => User, (user) => user.temporary_recipe)
  user: User;

  @Column()
  title: string;

  @Column()
  text: string;

  @Column()
  photos: string;

  @ManyToOne(() => RecipeCategory, (recipe_category) => recipe_category.recipe)
  recipe_category: RecipeCategory;

  @Column({
    type: 'enum',
    enum: RecipeStatus,
    default: RecipeStatus.Created,
  })
  status: RecipeStatus;

  @OneToMany(
    () => TemporaryRecipeProduct,
    (temporary_recipe_product) => temporary_recipe_product.temporary_recipe,
  )
  temporary_recipe_product: RecipeProduct;
}
