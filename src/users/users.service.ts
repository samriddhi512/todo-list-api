import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/createUser.dto';
import { encodePassword } from 'src/utils/bcrypt';
import { UpdateUserDto } from './dtos/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    // No relations here - we dont want the users with left join of all their todos - just users
    return this.userRepo.find();
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async create(userData: CreateUserDto): Promise<User> {
    const password = await encodePassword(userData.password);
    const newUser = {
      ...userData,
      password,
      address: JSON.stringify(userData.address),
    };
    const user = this.userRepo.create(newUser);
    return this.userRepo.save(user);
  }

  async update(id: number, userData: UpdateUserDto): Promise<User | null> {
    const updatedData: Partial<User> = {};
    if (userData.name !== undefined) updatedData.name = userData.name;
    if (userData.email !== undefined) updatedData.email = userData.email;
    if (userData.address !== undefined) {
      updatedData.address = JSON.stringify(userData.address);
    }
    await this.userRepo.update(id, updatedData);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.userRepo.delete(id);
  }
}
