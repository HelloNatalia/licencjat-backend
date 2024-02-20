import { IsString } from '@nestjs/class-validator';

export class CreateProductCategoryDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
}
