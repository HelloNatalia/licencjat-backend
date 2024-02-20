import { User } from 'src/auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id_address: string;

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

  @Column()
  postal_code: string;

  @ManyToOne(() => User, (user) => user.address)
  user: User;
}
