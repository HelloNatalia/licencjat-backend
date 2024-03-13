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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
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
    try {
      await this.usersRepository.remove(user);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
