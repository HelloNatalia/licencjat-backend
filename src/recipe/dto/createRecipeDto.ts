import { IsString } from '@nestjs/class-validator';
import { IsArray, IsUUID } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  title: string;

  @IsString()
  text: string;

  @IsString()
  photos: string;

  @IsUUID()
  id_recipe_category: string;

  @IsUUID(undefined, { each: true })
  list_id_products: string[];
}
