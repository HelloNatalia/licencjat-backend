import { IsString } from '@nestjs/class-validator';
import { Type } from 'class-transformer';
import { IsArray, IsUUID, ValidateNested } from 'class-validator';

class AmountObject {
  id: string;
  amount: string;
}

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  list_amount: AmountObject[];
}
