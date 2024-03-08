import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RecipeCategory } from './recipe-category.entity';
import { RecipeProduct } from './recipe-product.entity';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id_recipe: string;

  @Column()
  title: string;

  @Column()
  text: string;

  @Column()
  photos: string;

  @ManyToOne(() => RecipeCategory, (recipe_category) => recipe_category.recipe)
  recipe_category: RecipeCategory;

  @OneToMany(() => RecipeProduct, (recipe_product) => recipe_product.recipe)
  recipe_product: RecipeProduct;
}
