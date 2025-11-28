import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';

@Module({

    imports: [ConfigModule.forRoot({ isGlobal: true ,
      envFilePath: './apps/auth/.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('AUTH_DB_HOST'),
        port: configService.get<number>('AUTH_DB_PORT'),
        username: configService.get<string>('AUTH_DB_USER'),
      password: configService.get<string>('AUTH_DB_PASSWORD'),
      database: configService.get<string>('AUTH_DB_NAME'),
      entities: [__dirname + '/**/*.entity.{ts,js}'],
      synchronize: true,  // turn off in production
    })
}),
    TypeOrmModule.forFeature([User]),
  ],
})
export class DatabaseModule {
    
}
