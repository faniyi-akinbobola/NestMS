import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './users/users.controller';
import { AuthController } from './auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'your_jwt_secret_key', // Replace with your secret key
      signOptions: { expiresIn: '1h' }, // Token expiration time
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/api-gateway/.env',
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        RABBITMQ_URL: Joi.string().required(),
        EMAIL_QUEUE: Joi.string().required(),
        AUTH_QUEUE: Joi.string().required(),
        USERS_QUEUE: Joi.string().required(),
      }),
    }),
    ClientsModule.registerAsync([
      // Uncomment and configure EMAIL_SERVICE if needed
      // {
      //   name: 'EMAIL_SERVICE',
      //   useFactory: (configService: ConfigService) => ({
      //     transport: Transport.RMQ,
      //     options: {
      //       urls: [
      //         (() => {
      //           const url = configService.get<string>('RABBITMQ_URL');
      //           if (!url) {
      //             throw new Error('RABBITMQ_URL is not defined');
      //           }
      //           return url;
      //         })()
      //       ],
      //       queue: configService.get<string>('EMAIL_QUEUE') || 'email_queue',
      //       queueOptions: {
      //         durable: true
      //       },
      //     },
      //   }),
      //   inject: [ConfigService],
      // },
      {
        name: 'AUTH_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              (() => {
                const url = configService.get<string>('RABBITMQ_URL');
                if (!url) {
                  throw new Error('RABBITMQ_URL is not defined');
                }
                return url;
              })()
            ],
            queue: configService.get<string>('AUTH_QUEUE') || 'auth_queue',
            queueOptions: {
              durable: true
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'USER_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              (() => {
                const url = configService.get<string>('RABBITMQ_URL');
                if (!url) {
                  throw new Error('RABBITMQ_URL is not defined');
                }
                return url;
              })()
            ],
            queue: configService.get<string>('USERS_QUEUE') || 'users_queue',
            queueOptions: {
              durable: true
            },
          },
        }),
        inject: [ConfigService],
      }
    ])
  ],
  controllers: [ApiGatewayController, UsersController, AuthController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
