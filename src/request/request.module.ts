import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { Request } from './request.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announcement } from 'src/announcement/announcement.entity';
import { User } from 'src/auth/user.entity';
import { TakenProduct } from 'src/announcement/taken-product.entity';
import { Report } from 'src/report/report.entity';
import { ReportModule } from 'src/report/report.module';
import { ReportService } from 'src/report/report.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Request]),
    TypeOrmModule.forFeature([Announcement]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([TakenProduct]),
    TypeOrmModule.forFeature([Report]),
    ReportModule,
  ],
  controllers: [RequestController],
  providers: [RequestService, ReportService],
})
export class RequestModule {}
