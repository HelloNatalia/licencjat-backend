import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './address.entity';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/createAddressDto';
import { User } from 'src/auth/user.entity';
import { error } from 'console';

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

  async getUserAddresses(user: User): Promise<Address[]> {
    const address = await this.addressesRepository.findBy({ user });

    if (!address) {
      throw new NotFoundException("Selected user's address not found");
    }
    return address;
  }

  async getUserAddress(user: User): Promise<Address> {
    const address = await this.addressesRepository.findOneBy({ user });

    if (!address) {
      throw new NotFoundException("Selected user's address not found");
    }
    return address;
  }

  async deleteUserAddress(user: User, id: string): Promise<void> {
    try {
      await this.addressesRepository.delete({ id_address: id, user });
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async deleteAllUsersAddresses(user: User): Promise<void> {
    const addresses = await this.addressesRepository.findBy({ user });

    for (const address of addresses) {
      try {
        await this.addressesRepository.remove(address);
      } catch (error) {
        console.log(error.message);
        throw new InternalServerErrorException();
      }
    }
  }
}
