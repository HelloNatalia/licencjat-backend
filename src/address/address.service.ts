import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './address.entity';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/createAddressDto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressesRepository: Repository<Address>,
  ) {}

  async createAddress(
    createAddressDto: CreateAddressDto,
    user: User,
  ): Promise<void> {
    const { district, city, street, number, coordinates, postal_code } =
      createAddressDto;

    const address = this.addressesRepository.create({
      district,
      city,
      street,
      number,
      coordinates,
      postal_code,
      user,
    });

    try {
      await this.addressesRepository.save(address);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
