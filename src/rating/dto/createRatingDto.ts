import { IsNumber, IsUUID } from '@nestjs/class-validator';
import { IsString } from 'class-validator';

export class CreateRatingDto {
  @IsUUID()
  user_rated: string;

  @IsNumber()
  score: number;

  @IsString()
  text: string;

  @IsUUID()
  request: string;
}
