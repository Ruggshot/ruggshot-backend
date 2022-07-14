import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'hide-this',
      logging: true,

      //       usernameField: 'phone_number'
      //      logging: true,
    });
  }

  async validate(payload: any) {
    console.log('payload: ', payload);

    if (!payload.phone_number) {
      return { id: payload.sub, email: payload.email };
    } else {
      return { id: payload.sub, phone_number: payload.phone_number };
    }
  }
}
