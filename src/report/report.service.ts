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
import { ReportStatus } from './report-status.enum';

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

  async getReports(): Promise<Report[]> {
    const reports = await this.ReportsRepository.find();

    return reports;
  }

  async checkIfUserHasAcceptedReport(user: User): Promise<boolean> {
    const accepted = await this.ReportsRepository.findOneBy({
      user_reported: user,
      status: ReportStatus.Accepted,
    });

    if (accepted) return true;
    return false;
  }

  async acceptReport(id: string): Promise<void> {
    const report = await this.ReportsRepository.findOne({
      where: { id_report: id },
      relations: ['user_reported'],
    });

    if (!report) throw new NotFoundException();
    const user = report.user_reported;
    const allReports = await this.ReportsRepository.findBy({
      user_reported: user,
    });
    report.status = ReportStatus.Accepted;
    try {
      await this.ReportsRepository.save(report);
      for (const element of allReports) {
        element.status = ReportStatus.Accepted;
        await this.ReportsRepository.save(element);
      }
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException();
    }
  }

  async deleteReport(id: string): Promise<void> {
    const report = await this.ReportsRepository.findOneBy({ id_report: id });

    if (!report) throw new NotFoundException();
    try {
      await this.ReportsRepository.remove(report);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException();
    }
  }

  async findAndDeleteUsersReports(user: User): Promise<void> {
    const reportsUserCreated = await this.ReportsRepository.findBy({
      user_created: user,
    });

    const reportsUserReported = await this.ReportsRepository.findBy({
      user_reported: user,
    });

    for (const reportCreated of reportsUserCreated) {
      try {
        await this.ReportsRepository.remove(reportCreated);
      } catch (error) {
        console.log(error.message);
        throw new InternalServerErrorException();
      }
    }
    for (const reportReported of reportsUserReported) {
      try {
        await this.ReportsRepository.remove(reportReported);
      } catch (error) {
        console.log(error.message);
        throw new InternalServerErrorException();
      }
    }
  }
}
