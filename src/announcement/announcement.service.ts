import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Announcement } from './announcement.entity';
import { Not, Repository } from 'typeorm';
import { Product } from 'src/product/product.entity';
import { ProductCategory } from 'src/product_category/product_category.entity';
import { CreateAnnouncementDto } from './dto/createAnnouncementDto';
import { User } from 'src/auth/user.entity';
import { GetAnnouncementsFilterDto } from './dto/getAnnouncementsFilterDto';
import { Request } from 'src/request/request.entity';
import { StatusAnnouncement } from './status-announcement.enum';

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectRepository(Announcement)
    private announcementsRepository: Repository<Announcement>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductCategory)
    private productCategoryRepository: Repository<ProductCategory>,
    @InjectRepository(Request)
    private requestRepository: Repository<Request>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createAnnouncement(
    createAnnouncementDto: CreateAnnouncementDto,
    user: User,
  ): Promise<Announcement> {
    const {
      title,
      description,
      district,
      city,
      street,
      number,
      coordinates,
      available_dates,
      product_category,
      product,
      photos,
      date,
    } = createAnnouncementDto;

    const productObj = await this.productRepository.findOneBy({
      id_product: product,
    });
    const categoryObj = await this.productCategoryRepository.findOneBy({
      id_product_category: product_category,
    });
    if (!productObj || !categoryObj) {
      throw new NotFoundException('Selected product or category is wrong.');
    }

    const announcement = this.announcementsRepository.create({
      title,
      user: user,
      description,
      district,
      city,
      street,
      number,
      coordinates,
      available_dates,
      product_category: categoryObj,
      product: productObj,
      photos,
      date,
    });

    try {
      await this.announcementsRepository.save(announcement);
      return announcement;
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getAnnouncements(
    getAnnouncementsFilterDto: GetAnnouncementsFilterDto,
  ): Promise<Announcement[]> {
    const { search, product_id, product_category_id, city_name } =
      getAnnouncementsFilterDto;

    const query =
      this.announcementsRepository.createQueryBuilder('announcement');

    query
      .leftJoinAndSelect('announcement.user', 'user')
      .where('announcement.status = :status', { status: 'available' });

    query.leftJoinAndSelect(
      'announcement.product_category',
      'product_category',
    );

    if (search) {
      query.andWhere(
        '(LOWER(announcement.title) LIKE LOWER(:search) OR LOWER(announcement.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    if (product_id) {
      query.andWhere('(announcement.productIdProduct = :product_id)', {
        product_id,
      });
    }
    if (product_category_id) {
      query.andWhere(
        '(announcement.productCategoryIdProductCategory = :product_category_id)',
        {
          product_category_id,
        },
      );
    }
    if (city_name) {
      query.andWhere('(announcement.city = :city_name)', {
        city_name,
      });
    }

    try {
      const announcements = await query.getMany();
      return announcements;
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getAnnouncement(id: string): Promise<Announcement> {
    try {
      const announcement = await this.announcementsRepository.findOne({
        where: {
          id_announcement: id,
        },
        relations: ['user', 'product_category', 'product'],
      });
      if (!announcement) {
        throw new NotFoundException(`Announcement with id: ${id} not found`);
      }
      return announcement;
    } catch (error) {
      console.log(error.message);
      throw new NotFoundException(`Announcement with id: ${id} not found`);
    }
  }

  async getMyAnnouncements(user: User): Promise<Announcement[]> {
    const announcements = await this.announcementsRepository.findBy({ user });
    return announcements;
  }

  async deleteAnnouncement(user: User, id: string): Promise<void> {
    let announcement: Announcement | null;
    try {
      announcement = await this.announcementsRepository.findOne({
        where: {
          id_announcement: id,
          user,
        },
        relations: ['user'],
      });
    } catch (error) {
      throw new NotFoundException('Selected announcement not found');
    }

    if (announcement === null)
      throw new NotFoundException(`Selected announcement not found`);

    try {
      await this.requestRepository.delete({ announcement: announcement });
      await this.announcementsRepository.remove(announcement);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async editAnnouncement(
    user: User,
    id: string,
    createAnnouncementDto: CreateAnnouncementDto,
  ): Promise<void> {
    const {
      title,
      description,
      district,
      city,
      street,
      number,
      coordinates,
      available_dates,
      product_category,
      product,
      date,
    } = createAnnouncementDto;

    const announcement = await this.announcementsRepository.findOneBy({
      id_announcement: id,
    });
    if (!announcement) {
      throw new NotFoundException('Selected announcement not found');
    }

    const productObj = await this.productRepository.findOneBy({
      id_product: product,
    });
    const categoryObj = await this.productCategoryRepository.findOneBy({
      id_product_category: product_category,
    });
    if (!productObj || !categoryObj) {
      throw new NotFoundException('Selected product or category is wrong.');
    }

    announcement.title = title;
    announcement.description = description;
    announcement.district = district;
    announcement.city = city;
    announcement.street = street;
    announcement.number = number;
    announcement.coordinates = coordinates;
    announcement.available_dates = available_dates;
    announcement.product_category = categoryObj;
    announcement.product = productObj;
    announcement.date = date;

    try {
      await this.announcementsRepository.save(announcement);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getProductsNearby(id: string, city: string): Promise<number> {
    const product = await this.productRepository.findOneBy({ id_product: id });

    if (!product) {
      throw new NotFoundException('Selected product not found.');
    }

    const announcements = await this.announcementsRepository.findBy({
      city,
      product,
      status: StatusAnnouncement.Available,
    });

    if (!announcements || announcements.length === 0) return 0;
    return announcements.length;
  }
}
