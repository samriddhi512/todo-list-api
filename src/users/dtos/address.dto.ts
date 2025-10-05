import { IsNotEmpty } from 'class-validator';

export class AddressDto {
  @IsNotEmpty()
  line1: string;

  line2?: string;

  @IsNotEmpty()
  pincode: string;

  @IsNotEmpty()
  state: string;
}
