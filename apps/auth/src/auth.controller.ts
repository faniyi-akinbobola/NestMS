import { Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginDto, SignupDto } from '@app/common';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @MessagePattern('signin')
  login(@Payload() data: LoginDto){
    return this.authService.login(data.email, data.password);
  }

  @MessagePattern('signup')
  async signup(@Payload() data: SignupDto){
    return this.authService.signup(data.email, data.password);
  }

  @MessagePattern('validate_token')
  async validateToken(@Payload() token: string){
    return this.authService.validateToken(token);
  }
}
