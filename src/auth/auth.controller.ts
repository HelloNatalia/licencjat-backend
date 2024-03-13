import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupAuthCredentialsDto } from './dto/signup-auth-credentials.dto';
import { SigninAuthCredentialsDto } from './dto/signin-auth-credentials.dto';
import { Role } from './role.enum';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(
    @Body() signupAuthCredentialsDto: SignupAuthCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(signupAuthCredentialsDto);
  }

  @Post('signin')
  signIn(
    @Body() signinAuthCredentialsDto: SigninAuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(signinAuthCredentialsDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Client)
  @Get('user-data')
  getUserData(@GetUser() user: User): User {
    return user;
  }

  @Get('user-data/:id')
  getSpecificUserData(@Param('id') id: string): Promise<User> {
    return this.authService.getSpecificUserData(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Client)
  @Get('is-loggedin')
  isLoggedIn(@GetUser() user: User): void {
    if (!user) {
      throw new UnauthorizedException();
    } else return;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Client)
  @Delete('delete-account')
  deleteAccount(@GetUser() user: User): Promise<void> {
    return this.authService.deleteAccount(user);
  }
}
