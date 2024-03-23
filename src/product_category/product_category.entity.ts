import { Announcement } from 'src/announcement/announcement.entity';
import { TakenProduct } from 'src/announcement/taken-product.entity';
import { Product } from 'src/product/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductCategory {
  @PrimaryGeneratedColumn('uuid')
  id_product_category: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(
    () => Announcement,
    (announcement) => announcement.product_category,
  )
  announcement: Announcement;

  @OneToMany(() => Product, (product) => product.product_category)
  product: Product;

  @OneToMany(
    () => TakenProduct,
    (taken_product) => taken_product.product_category,
  )
  taken_product: TakenProduct;
}
