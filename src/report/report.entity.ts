import { User } from 'src/auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ReportStatus } from './report-status.enum';

@Entity()
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id_report: string;

  @ManyToOne(() => User, (user_created) => user_created.report_created)
  user_created: User;

  @ManyToOne(() => User, (user_reported) => user_reported.report_reported)
  user_reported: User;

  @Column()
  text: string;

  @Column({
    type: 'enum',
    enum: ReportStatus,
    array: false,
    default: [ReportStatus.Created],
  })
  status: ReportStatus;
}
