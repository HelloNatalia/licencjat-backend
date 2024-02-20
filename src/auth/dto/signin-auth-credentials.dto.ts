import { IsString } from '@nestjs/class-validator';
import { Length, Matches } from 'class-validator';

export class SigninAuthCredentialsDto {
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
  password: string;
}
