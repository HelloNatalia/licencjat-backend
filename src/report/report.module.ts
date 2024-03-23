import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { User } from 'src/auth/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
