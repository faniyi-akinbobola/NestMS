import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
    }),
    ClientsModule.registerAsync([
      {
        name: 'EMAIL_SERVICE',
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.get<string>('RABBITMQ_URL') || 'amqp://rabbitmq:5672'],
            queue: config.get<string>('EMAIL_QUEUE') || 'email_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
