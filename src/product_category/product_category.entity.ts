import { Announcement } from 'src/announcement/announcement.entity';
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
}
