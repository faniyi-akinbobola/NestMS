import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { CreateUserDto } from '@app/common';
import { UpdateUserDto } from '@app/common';

@Injectable()
export class UsersService {  
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getUserProfile({ id }: { id: string }): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUsers(): Promise<User[]> {
    const users = await this.usersRepository.find();
    if (!users) {
      throw new NotFoundException('No users found');
    } else {
      return users;
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = await this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

  async updateUser(id:string, updateUserDto:UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({id});
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

async deleteUser(id: string) {
  const user = await this.usersRepository.findOneBy({ id });

  if (!user) {
    return { error: 'User not found', status: 404 };  // return instead of throw
  }

  await this.usersRepository.delete(id);

  return { message: 'User deleted', user };
}
}
