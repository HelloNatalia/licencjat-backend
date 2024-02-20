import { Announcement } from 'src/announcement/announcement.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
}
