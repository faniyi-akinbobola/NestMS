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

  @Get()
  getUsers(){
    return this.usersService.getUsers();
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto){
    return this.usersService.createUser(createUserDto);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto){
    // Attach the id from the route parameter to the DTO before passing it to the service
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string){
    return this.usersService.deleteUser(id);
  }

}
