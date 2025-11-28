import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [DatabaseModule,PassportModule, ConfigModule.forRoot({ isGlobal: true ,
    envFilePath: './apps/auth/.env',
    validationSchema: Joi.object({
      RABBITMQ_URL: Joi.string().required(),
      AUTH_QUEUE: Joi.string().required(),
      AUTH_DB_HOST: Joi.string().required(),
      AUTH_DB_PORT: Joi.number().default(5432),
      AUTH_DB_USER: Joi.string().required(),
      AUTH_DB_PASSWORD: Joi.string().required(),
      AUTH_DB_NAME: Joi.string().required(),
     
    }),
  }), TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
