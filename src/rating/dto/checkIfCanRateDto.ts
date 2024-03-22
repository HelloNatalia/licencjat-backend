import { IsUUID } from '@nestjs/class-validator';

export class CheckIfCanRateDto {
  @IsUUID()
  user_to_rate: string;
}
