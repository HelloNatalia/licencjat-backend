import { IsOptional, IsUUID } from '@nestjs/class-validator';

export class FilterRecipesDto {
  @IsUUID(undefined, { each: true })
  @IsOptional()
  products_list: string[];

  @IsUUID()
  @IsOptional()
  id_recipe_category: string;
}
