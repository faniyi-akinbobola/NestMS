import { Controller, Get, Inject, Post, Req, UseGuards, Patch, Delete, Body, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices/client/client-proxy';
import { AuthGuard } from '../guards/auth/auth.guard';
import { firstValueFrom, timeout } from 'rxjs';

@Controller('users')
export class UsersController {
    constructor(@Inject('USER_SERVICE') private readonly userClient: ClientProxy) {}


    // @UseGuards(AuthGuard)
    @Get('profile')
    async getUserProfile(@Req() request) {
        const userId = request.user.id;
        const user$ = this.userClient.send({ cmd: 'get-user-profile' }, { id: userId }).pipe(timeout(5000));
        return await firstValueFrom(user$);
    }

    // @UseGuards(AuthGuard)
    @Get()
    async getUsers() {
        const users$ = this.userClient.send({ cmd: 'get-users' }, {}).pipe(timeout(5000));
        return await firstValueFrom(users$);
    }

    // @UseGuards(AuthGuard)
    @Post()
    async createUser(@Body() createUserDto) {
        const user$ = this.userClient.send({ cmd: 'create-user' }, createUserDto).pipe(timeout(5000));
        return await firstValueFrom(user$);
    }

    // @UseGuards(AuthGuard)
    @Patch(':id')
    async updateUser(@Param('id') id: string, @Body() updateUserDto) {
        const user$ = this.userClient.send({ cmd: 'update-user' }, { id, ...updateUserDto }).pipe(timeout(5000));
        return await firstValueFrom(user$);
    }

    // @UseGuards(AuthGuard)
    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        const user$ = this.userClient.send({ cmd: 'delete-user' },  id ).pipe(timeout(5000));
        return await firstValueFrom(user$);
    }

}
    