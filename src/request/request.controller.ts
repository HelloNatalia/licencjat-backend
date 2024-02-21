import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/createRequestDto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.Client)
@Controller('request')
export class RequestController {
  constructor(private requestService: RequestService) {}

  @Post('create')
  createRequest(
    @Body() createRequestDto: CreateRequestDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.requestService.createRequest(createRequestDto, user);
  }
}
