import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';
import { CreateReportDto } from './dto/createReportDto';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private ReportsRepository: Repository<Report>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createReport(
    user: User,
    createReportDto: CreateReportDto,
  ): Promise<void> {
    const { user_report, text } = createReportDto;

    const userReported = await this.usersRepository.findOneBy({
      id: user_report,
    });
    if (!userReported) {
      throw new NotFoundException('Selected user not found');
    }

    const report = this.ReportsRepository.create({
      user_created: user,
      user_reported: userReported,
      text,
    });

    try {
      await this.ReportsRepository.save(report);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
