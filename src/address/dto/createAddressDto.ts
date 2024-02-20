import { IsString, Length } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @Length(3, 100)
  district: string;

  @IsString()
  @Length(3, 100)
  city: string;

  @IsString()
  @Length(3, 100)
  street: string;

  @IsString()
  @Length(1, 10)
  number: string;

  @IsString()
  @Length(1, 50)
  coordinates: string;

  @IsString()
  @Length(3, 15)
  postal_code: string;
}
