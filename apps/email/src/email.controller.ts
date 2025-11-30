import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmailService } from './email.service';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  // -------------------------------
  // 📩 SIGNUP EMAIL
  // -------------------------------
  // @EventPattern('user_signup')
  // async handleUserSignup(
  //   @Payload()
  //   data: { email: string; name: string },
  // ) {
    
  //   const { email, name } = data;
  //   const userName = name ?? email.split('@')[0]; // use part of email as name
    
  //   await this.emailService.sendSignupEmail(email, userName);
  // }
//   @EventPattern('user_signup')
// async handleUserSignup(data: { email: string; name: string }) {
//   try {
//     const { email, name } = data;
//     const userName = name ?? email.split('@')[0];

//     await this.emailService.sendSignupEmail(email, userName);
//   } catch (error) {
//     console.error('Email sending failed:', error.message);
//     // DO NOT rethrow!
//   }
// }

@EventPattern('user_signup')
handleSignupEmail(@Payload() data) {
  console.log('SIGNUP EVENT RECEIVED', data);
  return this.emailService.sendSignupEmail(data.email, data.name);
}



  // -------------------------------
  // 🔐 LOGIN EMAIL
  // -------------------------------
  @EventPattern('user_login')
  async handleUserLogin(
    @Payload()
    data: { email: string; time: string },
  ) {
    const { email, time } = data;
    await this.emailService.sendLoginEmail(email, time);
  }



}
