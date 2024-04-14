import {
  ForbiddenException,
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
import { ChangeRequestStatusDto } from './dto/changeRequestStatusDto';
import { Status } from './status.enum';
import { DeleteRequestDto } from './dto/deleteRequestDto';
import { StatusAnnouncement } from 'src/announcement/status-announcement.enum';
import { ReportService } from 'src/report/report.service';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private requestsRepository: Repository<Request>,
    @InjectRepository(Announcement)
    private announcementsRepository: Repository<Announcement>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private reportsService: ReportService,
  ) {}

  async createRequest(
    createRequestDto: CreateRequestDto,
    user: User,
  ): Promise<void> {
    const { announcement, announcement_user, date, hour } = createRequestDto;
    if (await this.reportsService.checkIfUserHasAcceptedReport(user)) {
      throw new ForbiddenException();
    }
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
    const requests = await this.requestsRepository.find({
      where: {
        id_user_announcement: { id: user.id },
      },
      relations: ['id_user_request', 'announcement', 'id_user_announcement'],
    });

    return requests;
  }

  async getSentRequests(user: User): Promise<Request[]> {
    const requests = await this.requestsRepository.find({
      where: {
        id_user_request: { id: user.id },
      },
      relations: ['id_user_request', 'announcement', 'id_user_announcement'],
    });

    return requests;
  }

  async changeRequestStatus(
    id: string,
    user: User,
    changeRequestStatusDto: ChangeRequestStatusDto,
  ): Promise<void> {
    const { status } = changeRequestStatusDto;

    let requestObj: Request | null;
    try {
      requestObj = await this.requestsRepository.findOne({
        where: {
          id_request: id,
        },
        relations: ['id_user_announcement', 'announcement'],
      });

      if (requestObj === null) {
        throw new NotFoundException('Selected request not found');
      }
    } catch (error) {
      throw new NotFoundException('Selected request not found');
    }

    if (requestObj.id_user_announcement.id !== user.id) {
      console.log(requestObj.id_user_announcement);
      console.log(user);
      throw new NotFoundException(
        "Selected announcement doesn't belong to you",
      );
    }

    switch (status) {
      case 'accepted':
        requestObj.status = Status.Accepted;
        break;
      case 'received':
        requestObj.status = Status.Received;
        const announcementObj = requestObj.announcement;
        announcementObj.status = StatusAnnouncement.Received;
        try {
          this.announcementsRepository.save(announcementObj);
        } catch (error) {
          console.log(error.message);
          throw new InternalServerErrorException('Something went wrong');
        }
        break;
      default:
        throw new NotFoundException('Status type not found');
    }
    try {
      await this.requestsRepository.save(requestObj);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('something went wrong');
    }
  }

  async deleteRequest(
    id: string,
    user: User,
    deleteRequestDto: DeleteRequestDto,
  ): Promise<void> {
    const { message } = deleteRequestDto;
    let requestObj: Request | null;

    try {
      requestObj = await this.requestsRepository.findOne({
        where: {
          id_request: id,
        },
        relations: ['id_user_request', 'id_user_announcement', 'announcement'],
      });
      if (requestObj === null) {
        throw new NotFoundException('Selected request not found');
      }
    } catch (error) {
      throw new NotFoundException('Selected request not found');
    }

    if (requestObj.id_user_request.id === user.id) {
      // użytkownik anuluje wysłaną prośbę
    } else if (requestObj.id_user_announcement.id === user.id) {
      // użytkownik anuluje czyjąś rezerwacje, to jest właściciel ogłoszenia
    } else {
      throw new NotFoundException('You are not connected with this request');
    }

    try {
      await this.requestsRepository.remove(requestObj);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async deleteAllUsersRequests(user: User): Promise<string> {
    const requestsRequested = await this.requestsRepository.findBy({
      id_user_request: user,
    });
    const requestsAnnouncement = await this.requestsRepository.findBy({
      id_user_announcement: user,
    });
    try {
      for (const requestRequested of requestsRequested) {
        await this.requestsRepository.remove(requestRequested);
      }
      for (const requestAnnouncement of requestsAnnouncement) {
        await this.requestsRepository.remove(requestAnnouncement);
      }
      return 'success';
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException();
    }
  }
}
