import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { Announcement } from './announcement.entity';
import { CreateAnnouncementDto } from './dto/createAnnouncementDto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { GetAnnouncementsFilterDto } from './dto/getAnnouncementsFilterDto';

@Controller('announcement')
export class AnnouncementController {
  constructor(private announcementService: AnnouncementService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Client)
  @Post('create')
  createAnnouncement(
    @Body() createAnnouncementDto: CreateAnnouncementDto,
    @GetUser() user: User,
  ): Promise<Announcement> {
    return this.announcementService.createAnnouncement(
      createAnnouncementDto,
      user,
    );
  }

  @Get()
  getAnnouncements(
    @Query() getAnnouncementsFilterDto: GetAnnouncementsFilterDto,
  ): Promise<Announcement[]> {
    return this.announcementService.getAnnouncements(getAnnouncementsFilterDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Client)
  @Get('my-announcements')
  getMyAnnouncements(@GetUser() user: User): Promise<Announcement[]> {
    return this.announcementService.getMyAnnouncements(user);
  }

  @Get(':id')
  getAnnouncement(@Param('id') id: string): Promise<Announcement> {
    return this.announcementService.getAnnouncement(id);
  }

  @Delete(':id')
  deleteAnnouncement(
    @GetUser() user: User,
    @Param('id') id: string,
  ): Promise<void> {
    return this.announcementService.deleteAnnouncement(user, id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Client)
  @Patch('edit/:id')
  editAnnouncement(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() createAnnouncementDto: CreateAnnouncementDto,
  ): Promise<void> {
    return this.announcementService.editAnnouncement(
      user,
      id,
      createAnnouncementDto,
    );
  }
}
