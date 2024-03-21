import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RatingService } from './rating.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { CreateRatingDto } from './dto/createRatingDto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

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
}
