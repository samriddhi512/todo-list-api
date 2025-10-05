import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
// nest js interceptor to auto transform all responses.
// Uses instance to plain under the hoos and respects @exclude decorators.
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    if (user) {
      return user;
    } else throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true })) // validate according to dto + strip of extra properties if any
  async create(@Body() userData: CreateUserDto) {
    return this.usersService.create(userData);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(@Param('id') id: string, @Body() userData: UpdateUserDto) {
    const user = this.usersService.update(+id, userData);
    if (user) return user;
    throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usersService.delete(+id);
  }
}
