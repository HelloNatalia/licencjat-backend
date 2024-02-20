import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { Announcement } from './announcement.entity';
import { CreateAnnouncementDto } from './dto/createAnnouncementDto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

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
}
