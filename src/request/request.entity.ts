import { Announcement } from 'src/announcement/announcement.entity';
import { User } from 'src/auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from './status.enum';

@Entity()
export class Request {
  @PrimaryGeneratedColumn('uuid')
  id_request: string;

  @ManyToOne(() => User, (id_user_request) => id_user_request.id)
  id_user_request: User;

  @ManyToOne(() => Announcement, (announcement) => announcement.id_announcement)
  announcement: Announcement;

  @ManyToOne(() => User, (id_user_announcement) => id_user_announcement.id)
  id_user_announcement: User;

  @Column({
    type: 'enum',
    enum: Status,
    array: true,
    default: [Status.Sent],
  })
  status: Status;

  @Column()
  date: Date;

  @Column()
  hour: string;
}
