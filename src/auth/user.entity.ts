import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.enum';
import { Address } from 'src/address/address.entity';
import { Announcement } from 'src/announcement/announcement.entity';
import { FavouriteRecipe } from 'src/recipe/favourite-recipe.entity';
import { TemporaryRecipe } from 'src/recipe/temporary-recipe.entity';
import { Report } from 'src/report/report.entity';
import { Rating } from 'src/rating/rating.entity';
import { TakenProduct } from 'src/announcement/taken-product.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password_hash: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  email: string;

  @Column()
  phone_number: string;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.Client],
  })
  roles: Role[];

  @OneToMany(() => Address, (address) => address.user)
  address: Address;

  @OneToMany(() => Announcement, (announcement) => announcement.user)
  announcement: Announcement;

  @OneToMany(() => FavouriteRecipe, (favourite_recipe) => favourite_recipe.user)
  favourite_recipe: FavouriteRecipe;

  @OneToMany(() => TemporaryRecipe, (temporary_recipe) => temporary_recipe.user)
  temporary_recipe: TemporaryRecipe;

  @OneToMany(() => Report, (report_created) => report_created.user_created)
  report_created: Report;

  @OneToMany(() => Report, (report_reported) => report_reported.user_reported)
  report_reported: Report;

  @OneToMany(() => Rating, (rating_created) => rating_created.user_created)
  rating_created: Rating;

  @OneToMany(() => Rating, (rating_rated) => rating_rated.user_rated)
  rating_rated: Rating;

  @OneToMany(
    () => TakenProduct,
    (taken_product_request) => taken_product_request.user_request,
  )
  taken_product_request: TakenProduct;

  @OneToMany(
    () => TakenProduct,
    (taken_product_announcement) =>
      taken_product_announcement.user_announcement,
  )
  taken_product_announcement: TakenProduct;
}
