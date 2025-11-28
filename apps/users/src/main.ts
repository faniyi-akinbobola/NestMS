import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AllExceptionsFilter} from '@app/common'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(UsersModule,{
    transport: Transport.RMQ,
    options:{
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: process.env.USERS_QUEUE || 'users_queue',
      queueOptions: {
        durable: false
      },
    }
  });
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen();
}
bootstrap();
