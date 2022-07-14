import { Inject, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { env } from 'process';

@Module({
  imports: [
    ConfigService,
    PassportModule,
    UserModule,
    JwtModule.register({
      signOptions: { expiresIn: '1d' },
      secret: env.JWT_SECRET, // process.env.JWT_SECRET
    }),
  ],
  providers: [
    AuthResolver,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    PrismaService,
  ],
})
export class AuthModule {
  constructor() {}
}
