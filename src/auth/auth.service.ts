import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { isValidPassword } from 'src/utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async login(email: string, password: string) {
    const user = await this.usersService.findOne(1);
    if (!user) throw new BadRequestException();
    const result = await isValidPassword(password, user.password);
    if (!result) throw new UnauthorizedException();

    const jwtPayload = { sub: user.id, username: user.name };

    return {
      access_token: await this.jwtService.signAsync(jwtPayload),
    };
  }
}
