import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AllExceptionsFilter} from '@app/common'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule,{
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: process.env.AUTH_QUEUE || 'auth_queue',
      queueOptions: {
        durable: false
      },
    },  
  });
  app.useGlobalFilters(new AllExceptionsFilter());
  
  await app.listen();
  
}
bootstrap();
