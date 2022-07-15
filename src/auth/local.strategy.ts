import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { use } from 'passport';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'phone_number' });
  }

  async validate(phone_number: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(phone_number, password);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
