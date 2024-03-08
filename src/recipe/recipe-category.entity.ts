import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Recipe } from './recipe.entity';

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
}
