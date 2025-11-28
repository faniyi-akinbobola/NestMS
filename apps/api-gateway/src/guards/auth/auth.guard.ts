import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices/client/client-proxy';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject('AUTH_SERVICE') private readonly authClient: ClientProxy) {}
  async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean>  {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'] as string;
    if (!authHeader) {
      throw new UnauthorizedException('missing token');
    }
    const token = request.headers['authorization']?.split(' ')[1]; // Assuming Bearer token

    const result = await firstValueFrom(
      this.authClient.send<boolean>({ cmd: 'validate_token' }, token),
    );

    if (!result) {
      throw new UnauthorizedException('Invalid token');
    }

    request.user = result; // Attach user info to request object
    return true;
  }
}
