import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateReportDto } from './dto/createReportDto';
import { Report } from './report.entity';

@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Client)
  @Post('create')
  createReport(
    @GetUser() user: User,
    @Body() createReportDto: CreateReportDto,
  ): Promise<void> {
    return this.reportService.createReport(user, createReportDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @Get('reports')
  geteReports(): Promise<Report[]> {
    return this.reportService.getReports();
  }
}
