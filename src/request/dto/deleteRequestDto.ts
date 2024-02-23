import { IsString } from '@nestjs/class-validator';

export class DeleteRequestDto {
  @IsString()
  message: string;
}
