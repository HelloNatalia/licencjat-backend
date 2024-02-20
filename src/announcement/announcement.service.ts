import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Announcement } from './announcement.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/product/product.entity';
import { ProductCategory } from 'src/product_category/product_category.entity';
import { CreateAnnouncementDto } from './dto/createAnnouncementDto';
import { User } from 'src/auth/user.entity';
import { GetAnnouncementsFilterDto } from './dto/getAnnouncementsFilterDto';

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectRepository(Announcement)
    private announcementsRepository: Repository<Announcement>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductCategory)
    private productCategoryRepository: Repository<ProductCategory>,
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
    const { search, product_id, product_category_id } =
      getAnnouncementsFilterDto;

    const query =
      this.announcementsRepository.createQueryBuilder('announcement');
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

    try {
      const announcements = await query.getMany();
      return announcements;
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
