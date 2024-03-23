import { User } from 'src/auth/user.entity';
import { Product } from 'src/product/product.entity';
import { ProductCategory } from 'src/product_category/product_category.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TakenProduct {
  @PrimaryGeneratedColumn('uuid')
  id_taken_product: string;

  @ManyToOne(() => User, (user_request) => user_request.taken_product_request)
  user_request: User;

  @ManyToOne(
    () => User,
    (user_announcement) => user_announcement.taken_product_announcement,
  )
  user_announcement: User;

  @ManyToOne(() => Product, (product) => product.taken_product)
  product: Product;

  @ManyToOne(
    () => ProductCategory,
    (product_category) => product_category.taken_product,
  )
  product_category: ProductCategory;

  date: Date;
}
