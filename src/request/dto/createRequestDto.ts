import { IsUUID } from '@nestjs/class-validator';
import { IsDate, IsString } from 'class-validator';

export class CreateRequestDto {
  @IsUUID()
  announcement: string;

  @IsUUID()
  announcement_user: string;

  @IsDate()
  date: Date;

  @IsString()
  hour: string;
}
