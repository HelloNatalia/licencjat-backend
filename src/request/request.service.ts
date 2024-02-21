import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from './request.entity';
import { CreateRequestDto } from './dto/createRequestDto';
import { User } from 'src/auth/user.entity';
import { Announcement } from 'src/announcement/announcement.entity';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private requestsRepository: Repository<Request>,
    @InjectRepository(Announcement)
    private announcementsRepository: Repository<Announcement>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createRequest(
    createRequestDto: CreateRequestDto,
    user: User,
  ): Promise<void> {
    const { announcement, announcement_user, date, hour } = createRequestDto;
    const announcementObj = await this.announcementsRepository.findOneBy({
      id_announcement: announcement,
    });
    if (!announcementObj) {
      throw new NotFoundException('Announcement with given id not found');
    }

    const announcementUserObj = await this.usersRepository.findOneBy({
      id: announcement_user,
    });
    if (!announcementUserObj) {
      throw new NotFoundException("Announcement's user not found");
    }

    const request = this.requestsRepository.create({
      id_user_request: user,
      announcement: announcementObj,
      id_user_announcement: announcementUserObj,
      date,
      hour,
    });

    try {
      this.requestsRepository.save(request);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getReceivedRequests(user: User): Promise<Request[]> {
    const requests = this.requestsRepository.find({
      where: {
        id_user_announcement: { id: user.id },
      },
    });

    return requests;
  }
}
