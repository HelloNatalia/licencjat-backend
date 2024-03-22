import { Module } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from './rating.entity';
import { User } from 'src/auth/user.entity';
import { Request } from 'src/request/request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rating]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Request]),
  ],
  controllers: [RatingController],
  providers: [RatingService],
})
export class RatingModule {}
