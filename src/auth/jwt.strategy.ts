// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Token expiration will be handled
      secretOrKey: 'your_jwt_secret_key', // Use environment variables in production
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOneById(payload.sub);
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
