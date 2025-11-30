import { Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginDto, SignupDto } from '@app/common';
import { RpcException } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @MessagePattern({cmd:'signin'})
  login(@Payload() data: LoginDto){
    return this.authService.login(data.email, data.password);
  }

@MessagePattern({ cmd: 'signup' })
async signup(@Payload() data: SignupDto) {
  try {
    return await this.authService.signup(data);
  } catch (err) {
    throw new RpcException(err.message);
  }
}


  @MessagePattern({cmd:'validate_token'})
  async validateToken(@Payload() token: string){
    return this.authService.validateToken(token);
  }
}
