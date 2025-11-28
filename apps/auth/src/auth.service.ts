import { Inject, Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm/repository/Repository.js';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ClientProxy } from '@nestjs/microservices/client/client-proxy';


@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
private readonly jwtService: JwtService, @Inject('EMAIL_SERVICE') private readonly emailClient: ClientProxy ) {}

  async signup(email: string, password: string) {
    // Check if user already exists
    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('Email already in use');
    }
    // Replace with password hashing in production
    const user = this.userRepository.create({ email, password });
    await this.userRepository.save(user);
    const name = email.split('@')[0]; // use part of email as name

    await this.emailClient.emit('user_signup', { email, name });
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);
    return {
      accessToken,
      user: { id: user.id, email: user.email },
    };
  }

async login(email: string, password: string) {
  const user = await this.userRepository.findOne({ where: { email } });
  if (!user) throw new UnauthorizedException('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new UnauthorizedException('Invalid credentials');

  const payload = { sub: user.id, email: user.email };
  const accessToken = await this.jwtService.signAsync(payload);
  await this.emailClient.emit('user_login', { email, time: new Date().toISOString() });

  return {
    accessToken,
    user: { id: user.id, email: user.email },
  };
}

async validateToken(token: string): Promise<any> {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      return decoded;
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  // async validateUser(username: string, pass: string): Promise<any> {
  //   // Implement your user validation logic here.
  //   // For example, query the database to find the user and verify the password.
  //   const user = { username: 'testuser', password: 'testpass' }; // Dummy user for illustration

  //   if (user && user.password === pass) {
  //     const { password, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }
}
