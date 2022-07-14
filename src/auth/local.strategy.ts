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
    console.log('user');
    if (!user) {
      console.log('user not found');
      const admin = await this.authService.validateAdmin(
        phone_number,
        password,
      );
      if (!admin) {
        throw new UnauthorizedException();
      } else {
        return admin;
      }
    }
    return user;
  }
}
