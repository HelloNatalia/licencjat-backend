import { User } from 'src/auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Recipe } from './recipe.entity';

@Entity()
export class FavouriteRecipe {
  @PrimaryGeneratedColumn('uuid')
  id_favourite_recipe: string;

  @ManyToOne(() => User, (user) => user.favourite_recipe)
  user: User;

  @ManyToOne(() => Recipe, (recipe) => recipe.favourite_recipe)
  recipe: Recipe;
}
