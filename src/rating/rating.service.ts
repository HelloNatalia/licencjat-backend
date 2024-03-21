import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating } from './rating.entity';
import { User } from 'src/auth/user.entity';
import { Repository } from 'typeorm';
import { CreateRatingDto } from './dto/createRatingDto';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createRating(
    createRatingDto: CreateRatingDto,
    user: User,
  ): Promise<void> {
    const { user_rated, score, text } = createRatingDto;

    const userRated = await this.usersRepository.findOneBy({ id: user_rated });

    if (!userRated) {
      throw new NotFoundException('Selected user not found');
    }

    const rating = this.ratingsRepository.create({
      user_created: user,
      user_rated: userRated,
      score,
      text,
    });

    try {
      await this.ratingsRepository.save(rating);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Something went wrong');
    }

    // Sprawdzić, czy obie osoby wystawiły sobie opinie, jeżeli tak, to zmienić status requesta na reviewed!
  }
}
