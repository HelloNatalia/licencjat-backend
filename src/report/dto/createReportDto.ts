import { IsString } from '@nestjs/class-validator';
import { IsUUID } from 'class-validator';

export class CreateReportDto {
  @IsUUID()
  user_report: string;

  @IsString()
  text: string;
}
