import { LoginDto, SignupDto } from '@app/common';
import { Controller, Inject, Post , Body} from '@nestjs/common';
import {  ClientProxy } from '@nestjs/microservices';
import { time } from 'console';
import { timeout } from 'rxjs';

@Controller('auth')
export class AuthController {
    constructor(
        @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    ) {}

@Post('signin')
signin(@Body() body: LoginDto) {
  return this.authClient.send({ cmd: 'signin' }, body).pipe(timeout(5000));
}

@Post('signup')
signup(@Body() body: SignupDto) {
  return this.authClient.send({ cmd: 'signup' }, body).pipe(timeout(5000));
}



}