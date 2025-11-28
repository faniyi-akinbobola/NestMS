import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

@Module({
  imports: [DatabaseModule,
    TypeOrmModule.forFeature([User]),
     ConfigModule.forRoot({
    validationSchema: Joi.object({
      RABBITMQ_URL: Joi.string().uri().required(),
      USERS_QUEUE: Joi.string().required(),
      MYSQL_HOST: Joi.string().required(),
      MYSQL_PORT: Joi.number().default(3306),
      MYSQL_USERNAME: Joi.string().required(),
      MYSQL_PASSWORD: Joi.string().required(),
      MYSQL_DATABASE: Joi.string().required(),
     }),
    envFilePath: './apps/users/.env', 
    }),
  ],

  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
