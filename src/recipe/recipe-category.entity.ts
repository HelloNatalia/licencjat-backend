import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Recipe } from './recipe.entity';
import { TemporaryRecipe } from './temporary-recipe.entity';

@Entity()
export class RecipeCategory {
  @PrimaryGeneratedColumn('uuid')
  id_recipe_category: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Recipe, (recipe) => recipe.recipe_category)
  recipe: Recipe;

  @OneToMany(
    () => TemporaryRecipe,
    (temporary_recipe) => temporary_recipe.recipe_category,
  )
  temporary_recipe: TemporaryRecipe;
}
