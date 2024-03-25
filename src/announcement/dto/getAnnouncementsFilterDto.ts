import { IsOptional, IsString } from '@nestjs/class-validator';
import { IsUUID } from 'class-validator';

export class GetAnnouncementsFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsUUID()
  product_id: string;

  @IsOptional()
  @IsUUID()
  product_category_id: string;

  @IsOptional()
  @IsString()
  city_name: string;
}
