import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/createRequestDto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { Request } from './request.entity';
import { ChangeRequestStatusDto } from './dto/changeRequestStatusDto';
import { DeleteRequestDto } from './dto/deleteRequestDto';

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

  @Get('received-requests')
  getReceivedRequests(@GetUser() user: User): Promise<Request[]> {
    return this.requestService.getReceivedRequests(user);
  }

  @Get('sent-requests')
  getSentRequests(@GetUser() user: User): Promise<Request[]> {
    return this.requestService.getSentRequests(user);
  }

  @Patch('change-status/:id')
  changeRequestStatus(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body() changeRequestStatusSto: ChangeRequestStatusDto,
  ): Promise<void> {
    return this.requestService.changeRequestStatus(
      id,
      user,
      changeRequestStatusSto,
    );
  }

  @Delete(':id')
  deleteRequest(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body() deleteRequestDto: DeleteRequestDto,
  ): Promise<void> {
    return this.requestService.deleteRequest(id, user, deleteRequestDto);
  }
}
