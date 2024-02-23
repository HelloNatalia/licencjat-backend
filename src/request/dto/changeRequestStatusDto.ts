import { IsEnum } from '@nestjs/class-validator';
import { Status } from '../status.enum';
import { Transform } from 'class-transformer';

export class ChangeRequestStatusDto {
  status: string;
}
