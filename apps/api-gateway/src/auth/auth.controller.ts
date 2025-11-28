import { LoginDto, SignupDto } from '@app/common';
import { Controller, Inject, Post , Body} from '@nestjs/common';
import {  ClientProxy } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
    constructor(
        @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    ) {}

@Post('signin')
signin(@Body() body: LoginDto) {
  return this.authClient.send({ cmd: 'signin' }, body);
}

@Post('signup')
signup(@Body() body: SignupDto) {
  return this.authClient.send({ cmd: 'signup' }, body);
}



}