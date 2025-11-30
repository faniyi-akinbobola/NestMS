import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_jwt_secret',
      signOptions: { expiresIn: '1d' },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/auth/.env',
      validationSchema: Joi.object({
        RABBITMQ_URL: Joi.string().required(),
        AUTH_QUEUE: Joi.string().required(),
        AUTH_DB_HOST: Joi.string().required(),
        AUTH_DB_PORT: Joi.number().default(5432),
        AUTH_DB_USER: Joi.string().required(),
        AUTH_DB_PASSWORD: Joi.string().required(),
        AUTH_DB_NAME: Joi.string().required(),
        EMAIL_QUEUE: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forFeature([User]),
    ClientsModule.registerAsync([
      {
        name: 'EMAIL_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL') || 'amqp://rabbitmq:5672'],
            queue: configService.get<string>('EMAIL_QUEUE') || 'email_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
