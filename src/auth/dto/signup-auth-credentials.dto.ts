import { IsString, Length, Matches } from '@nestjs/class-validator';
import { IsAlpha, IsEmail } from 'class-validator';

export class SignupAuthCredentialsDto {
  @IsString()
  @Length(4, 30)
  username: string;

  @IsString()
  @Length(8, 32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: `Password is to weak, it must contain:
      - at least 1 upper case letter, 
      - at least 1 lower case letter,
      - at least 1 number or special character.`,
  })
  password_hash: string;

  @IsString()
  @Length(2, 50)
  name: string;

  @IsString()
  @Length(2, 100)
  surname: string;

  @IsEmail()
  email: string;

  @IsAlpha()
  phone_number: string;
}
