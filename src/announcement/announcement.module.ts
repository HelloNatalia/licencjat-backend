import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announcement } from './announcement.entity';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementService } from './announcement.service';
import { Product } from 'src/product/product.entity';
import { ProductCategory } from 'src/product_category/product_category.entity';
import { Request } from 'src/request/request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Announcement]),
    TypeOrmModule.forFeature([Product]),
    TypeOrmModule.forFeature([ProductCategory]),
    TypeOrmModule.forFeature([Request]),
  ],
  controllers: [AnnouncementController],
  providers: [AnnouncementService],
})
export class AnnouncementModule {}
