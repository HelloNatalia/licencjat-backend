import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/createAddressDto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.Client)
@Controller('address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Post('create')
  createAddress(
    @Body() createAddressDto: CreateAddressDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.addressService.createAddress(createAddressDto, user);
  }
}
