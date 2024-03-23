import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RatingService } from './rating.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { CreateRatingDto } from './dto/createRatingDto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CheckIfCanRateDto } from './dto/checkIfCanRateDto';
import { Rating } from './rating.entity';

@Controller('rating')
export class RatingController {
  constructor(private ratingsService: RatingService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Client)
  @Post('create')
  createRating(
    @Body() createRatingDto: CreateRatingDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.ratingsService.createRating(createRatingDto, user);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Client)
  @Post('check-if-can-rate')
  checkIfCanRate(
    @Body() checkIfCanRateDto: CheckIfCanRateDto,
    @GetUser() user: User,
  ): Promise<any> {
    return this.ratingsService.checkIfCanRate(checkIfCanRateDto, user);
  }

  @Get('user-ratings-info/:id')
  getUserRatingsInfo(@Param('id') id: string): Promise<any> {
    return this.ratingsService.getUserRatingsInfo(id);
  }

  @Get('user-ratings/:id')
  getUserRatings(@Param('id') id: string): Promise<Rating[]> {
    return this.ratingsService.getUserRatings(id);
  }
}
