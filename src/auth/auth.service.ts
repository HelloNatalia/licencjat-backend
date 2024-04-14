import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { SignupAuthCredentialsDto } from './dto/signup-auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';
import { SigninAuthCredentialsDto } from './dto/signin-auth-credentials.dto';
import { AddressService } from 'src/address/address.service';
import { AnnouncementService } from 'src/announcement/announcement.service';
import { RecipeService } from 'src/recipe/recipe.service';
import { RatingService } from 'src/rating/rating.service';
import { ReportService } from 'src/report/report.service';
import { RequestService } from 'src/request/request.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private addressService: AddressService,
    private announcementService: AnnouncementService,
    private recipeService: RecipeService,
    private ratingService: RatingService,
    private reportService: ReportService,
    private requestService: RequestService,
  ) {}

  async signUp(
    signupAuthCredentialsDto: SignupAuthCredentialsDto,
  ): Promise<void> {
    const { username, password_hash, name, surname, email, phone_number } =
      signupAuthCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password_hash, salt);

    const user = this.usersRepository.create({
      username,
      password_hash: hashedPassword,
      name,
      surname,
      email,
      phone_number,
    });

    try {
      await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(
    signinAuthCredentialsDto: SigninAuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = signinAuthCredentialsDto;

    const user = await this.usersRepository.findOneBy({ username });

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken: accessToken };
    } else {
      throw new UnauthorizedException('Please, check your login credentials');
    }
  }

  async getSpecificUserData(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Selected user not found');
    }

    return user;
  }

  async deleteAccount(user: User): Promise<void> {
    //adresy, ogłoszenia, ulubione przepisy, oceny, zgłoszenia, prośby, tymczasope produkt przepis, tymczasowe przepisy
    await this.addressService.deleteAllUsersAddresses(user);
    await this.requestService.deleteAllUsersRequests(user);
    await this.announcementService.deleteAllUsersAnnouncements(user);
    await this.recipeService.deleteAllUsersFavouriteRecipes(user);
    await this.recipeService.deleteAllUsersTemporaryRecipes(user);
    await this.ratingService.deleteAllUsersRatings(user);
    await this.reportService.findAndDeleteUsersReports(user);
    try {
      await this.usersRepository.remove(user);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async editAccount(
    user: User,
    signupAuthCredentialsDto: SignupAuthCredentialsDto,
  ): Promise<void> {
    const { username, password_hash, name, surname, email, phone_number } =
      signupAuthCredentialsDto;

    if (user && (await bcrypt.compare(password_hash, user.password_hash))) {
      user.username = username;
      user.name = name;
      user.surname = surname;
      user.email = email;
      user.phone_number = phone_number;
      try {
        this.usersRepository.save(user);
      } catch (error) {
        console.log(error.message);
        throw new InternalServerErrorException('Something went wrong');
      }
    } else {
      throw new UnauthorizedException('Please, check your login credentials');
    }
  }
}
