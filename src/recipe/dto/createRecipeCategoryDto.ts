import { IsString } from '@nestjs/class-validator';

export class CreateRecipeCategoryDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
}
