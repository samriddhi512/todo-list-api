import {
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsStrongPassword,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from '../../users/dtos/address.dto';
import { Type } from 'class-transformer';

export class RegisterDto {
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsStrongPassword()
  password: string;

  @ValidateNested()
  @Type(() => AddressDto)
  @IsNotEmptyObject()
  address: AddressDto;
}
