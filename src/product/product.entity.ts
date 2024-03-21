import { Announcement } from 'src/announcement/announcement.entity';
import { ProductCategory } from 'src/product_category/product_category.entity';
import { RecipeProduct } from 'src/recipe/recipe-product.entity';
import { TemporaryRecipeProduct } from 'src/recipe/temporary-recipe-product.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id_product: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Announcement, (announcement) => announcement.product)
  announcement: Announcement;

  @ManyToOne(
    () => ProductCategory,
    (product_category) => product_category.product,
  )
  product_category: ProductCategory;

  @OneToMany(() => RecipeProduct, (recipe_product) => recipe_product.product)
  recipe_product: RecipeProduct;

  @OneToMany(
    () => TemporaryRecipeProduct,
    (temporary_recipe_product) => temporary_recipe_product.product,
  )
  temporary_recipe_product: TemporaryRecipeProduct;
}
