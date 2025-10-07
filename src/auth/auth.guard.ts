import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException();
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      request['user'] = payload;
    } catch (err) {
      throw new UnauthorizedException();
    }

    return true; // indicates current request is allowed.
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

// Note taken this from the official nest documentation

// suppose ur jwt token payload was {sub: id, name: 'xyz'}. Then this is the payload when token is verified.
// guards - decide whether a request will be handled by a route handler or not. - Authorisation.

// this is handled by middleware in express, difference from guards:
// middleware is 'dumb' does not know which handler is executed after it calls the next function.
// but guards have access to the execution context.
// Guards are executed after all middleware, but before any interceptor or pipe.
