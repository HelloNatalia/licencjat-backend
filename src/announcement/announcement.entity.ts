import { User } from 'src/auth/user.entity';
import { Product } from 'src/product/product.entity';
import { ProductCategory } from 'src/product_category/product_category.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Announcement {
  @PrimaryGeneratedColumn('uuid')
  id_announcement: string;

  @Column()
  title: string;

  @ManyToOne(() => User, (user) => user.announcement)
  user: User;

  @Column()
  description: string;

  @Column()
  district: string;

  @Column()
  city: string;

  @Column()
  street: string;

  @Column()
  number: string;

  @Column()
  coordinates: string;

  @Column('jsonb')
  available_dates: any;

  @ManyToOne(
    () => ProductCategory,
    (product_category) => product_category.announcement,
  )
  product_category: ProductCategory;

  @ManyToOne(() => Product, (product) => product.announcement)
  product: Product;

  @Column()
  photos: string;
}
