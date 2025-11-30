import { Controller, Delete, Get, Patch, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from '@app/common'
import { CreateUserDto } from '@app/common';
import { User } from '../entities/user.entity';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('get-user-profile')
  getUserProfile(@Payload() userId: string) {
    return this.usersService.getUserProfile({ id: userId });
  }

  @MessagePattern({cmd:'get-users'})
  getUsers(){
    return this.usersService.getUsers();
  }

  @MessagePattern({cmd:'create-user'})
  createUser(@Payload() createUserDto: CreateUserDto){
    return this.usersService.createUser(createUserDto);
  }

  @MessagePattern({cmd:'update-user'})
  updateUser(@Payload() data: { id: string, updateUserDto: UpdateUserDto }){
    return this.usersService.updateUser(data.id, data.updateUserDto);
  }

  @MessagePattern({cmd:'delete-user'})
  deleteUser(@Payload() id: string){
    return this.usersService.deleteUser(id);
  }


}
