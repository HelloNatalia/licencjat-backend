import { IsUUID } from '@nestjs/class-validator';

export class AddToFavouriteDto {
  @IsUUID()
  id_recipe: string;
}
