import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announcement } from './announcement.entity';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementService } from './announcement.service';
import { Product } from 'src/product/product.entity';
import { ProductCategory } from 'src/product_category/product_category.entity';
import { Request } from 'src/request/request.entity';
import { TakenProduct } from './taken-product.entity';
import { User } from 'src/auth/user.entity';
import { ReportService } from 'src/report/report.service';
import { ReportModule } from 'src/report/report.module';
import { Report } from 'src/report/report.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Announcement]),
    TypeOrmModule.forFeature([Product]),
    TypeOrmModule.forFeature([ProductCategory]),
    TypeOrmModule.forFeature([Request]),
    TypeOrmModule.forFeature([TakenProduct]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Report]),
    ReportModule,
  ],
  controllers: [AnnouncementController],
  providers: [AnnouncementService, ReportService],
})
export class AnnouncementModule {}
