import { Announcement } from 'src/announcement/announcement.entity';
import { ProductCategory } from 'src/product_category/product_category.entity';
import { RecipeProduct } from 'src/recipe/recipe-product.entity';
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
}
