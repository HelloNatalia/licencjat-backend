import { IsArray, IsDate } from '@nestjs/class-validator';
import { IsString, Length } from 'class-validator';

export class CreateAnnouncementDto {
  @IsString()
  @Length(3, 60)
  title: string;

  @IsString()
  @Length(10, 255)
  description: string;

  @IsString()
  @Length(3, 60)
  district: string;

  @IsString()
  @Length(3, 50)
  city: string;

  @IsString()
  @Length(3, 100)
  street: string;

  @IsString()
  @Length(1, 20)
  number: string;

  @IsString()
  @Length(1, 150)
  coordinates: string;

  @IsArray()
  available_dates: any;

  @IsString()
  product_category: string;

  @IsString()
  product: string;

  @IsString()
  @Length(5, 255)
  photos: string;

  @IsDate()
  date: Date;
}
