import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dtos/createUser.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { isValidPassword } from 'src/utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await isValidPassword(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const jwtPayload = { sub: user.id, name: user.name, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(jwtPayload),
      user,
    };
  }

  async signup(createUserDto: CreateUserDto) {
    const { password, ...user } = await this.usersService.create(createUserDto);
    const jwtPayload = {
      sub: user.id,
      name: user.name,
      email: user.email,
    };

    return {
      access_token: await this.jwtService.signAsync(jwtPayload),
      user,
    };
  }
}
