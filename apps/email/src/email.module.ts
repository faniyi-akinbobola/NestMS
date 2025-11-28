import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, 
    validationSchema: Joi.object({
      RABBITMQ_URL: Joi.string().required(),
      EMAIL_QUEUE: Joi.string().required(),
      EMAIL_HOST: Joi.string().required(),
      EMAIL_PORT: Joi.number().required(),
      EMAIL_USER: Joi.string().required(),
      EMAIL_PASSWORD: Joi.string().required(),
      EMAIL_FROM: Joi.string().required(),
    }),
    envFilePath: './apps/email/.env',
   })],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
