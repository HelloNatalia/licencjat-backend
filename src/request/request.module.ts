import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { Request } from './request.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announcement } from 'src/announcement/announcement.entity';
import { User } from 'src/auth/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Request]),
    TypeOrmModule.forFeature([Announcement]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}