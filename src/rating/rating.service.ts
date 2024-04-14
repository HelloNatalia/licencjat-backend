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
import { Request } from 'src/request/request.entity';
import { Status } from 'src/request/status.enum';
import { CheckIfCanRateDto } from './dto/checkIfCanRateDto';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Request)
    private requestsRepository: Repository<Request>,
  ) {}

  async createRating(
    createRatingDto: CreateRatingDto,
    user: User,
  ): Promise<void> {
    const { user_rated, score, text, request } = createRatingDto;

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
    const rating1 = await this.ratingsRepository.findOne({
      where: { user_created: user, user_rated: userRated },
    });
    const rating2 = await this.ratingsRepository.findOne({
      where: { user_created: userRated, user_rated: user },
    });
    if (rating1 && rating2) {
      const requestToChange = await this.requestsRepository.findOneBy({
        id_request: request,
      });
      if (requestToChange) {
        requestToChange.status = Status.Reviewed;
        try {
          await this.requestsRepository.save(requestToChange);
        } catch (error) {
          console.log(error.message);
          throw new InternalServerErrorException('Something went wrong');
        }
      }
    }
  }

  async checkIfCanRate(
    checkIfCanRateDto: CheckIfCanRateDto,
    user: User,
  ): Promise<any> {
    const { user_to_rate } = checkIfCanRateDto;

    const userToRate = await this.usersRepository.findOneBy({
      id: user_to_rate,
    });
    if (!userToRate) {
      throw new NotFoundException('Selected user not found');
    }

    const rating = await this.ratingsRepository.findOne({
      where: { user_created: user, user_rated: userToRate },
    });

    if (rating) return { can_rate: false };
    else return { can_rate: true };
  }

  async getUserRatingsInfo(id: string): Promise<any> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Selected user not found');
    }

    const ratings = await this.ratingsRepository.findBy({ user_rated: user });
    let toReturn = {};
    const amount = ratings.length;
    if (amount > 0) {
      let sum = 0;
      ratings.map((element) => {
        sum += element.score;
      });
      const rate = (sum / amount).toFixed(1);

      toReturn = {
        rate,
        total: amount,
      };
    } else {
      toReturn = {
        rate: 0,
        total: 0,
      };
    }

    return toReturn;
  }

  async getUserRatings(id: string): Promise<Rating[]> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Selected user not found');
    }

    const ratings = await this.ratingsRepository.find({
      where: { user_rated: user },
      relations: ['user_created'],
    });

    return ratings;
  }

  async deleteAllUsersRatings(user: User): Promise<void> {
    const ratings_created = await this.ratingsRepository.findBy({
      user_created: user,
    });
    const ratings_rated = await this.ratingsRepository.findBy({
      user_rated: user,
    });
    try {
      for (const rating_created of ratings_created) {
        await this.ratingsRepository.remove(rating_created);
      }
      for (const rating_rated of ratings_rated) {
        await this.ratingsRepository.remove(rating_rated);
      }
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException();
    }
  }
}
