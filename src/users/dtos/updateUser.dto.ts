import { Type } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from './address.dto';

export class UpdateUserDto {
  @IsOptional()
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;
}
