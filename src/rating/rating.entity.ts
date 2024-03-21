import { User } from 'src/auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id_rating: string;

  @ManyToOne(() => User, (user_created) => user_created.rating_created)
  user_created: User;

  @ManyToOne(() => User, (user_rated) => user_rated.rating_rated)
  user_rated: User;

  @Column()
  score: number;

  @Column()
  text: string;
}
