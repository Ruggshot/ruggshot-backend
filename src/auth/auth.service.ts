import {
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginUserInput } from './dto/login-user.input';
import { JwtService } from '@nestjs/jwt';
import * as bcrpyt from 'bcrypt';
import { randomInt } from 'crypto';
import { InjectTwilio, TwilioClient } from 'nestjs-twilio';
import { ConfigService } from '@nestjs/config';
import { DateTime } from 'luxon';
import { ApolloError } from 'apollo-server-express';
import { use } from 'passport';

@Injectable()
export class AuthService {
  constructor(
    @Inject(PrismaService) private prismaService: PrismaService,
    @InjectTwilio() private readonly client: TwilioClient,
    @Inject(ConfigService) private cfg: ConfigService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(phone_number: string, password: string): Promise<any> {
    const user = await this.userService.findOne(phone_number);

    if (!user) {
      throw new ApolloError(
        'User not yet registered for Ruggshot. Please contact your team leader to get started',
        '409',
      );
    }

    const valid = await bcrpyt.compare(password, user?.password);

    if (user && valid) {
      const { password, ...result } = user; // password is stripped from user
      return result;
    }
    return null;
  }

  async login(user: User) {
    return {
      access_token: this.jwtService.sign({
        phone_number: user.phone_number,
        sub: user.id,
      }),
      user,
    };
  }

  async findUser(phone_number: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        phone_number: phone_number,
      },
    });
    if (user) {
      const otp = randomInt(100000, 999999);
      const message = `This is your One Time shneeb: ${otp}`;

      try {
        await this.client.messages.create({
          body: message,
          from: this.cfg.get('TWILIO_PHONE_NUMBER'),
          to: user.phone_number,
        });
        console.log('otp sent');
        try {
          await this.prismaService.user.update({
            where: {
              id: user.id,
            },
            data: {
              otp: otp,
              otp_exp_date: DateTime.utc().plus({ minutes: 3 }).toISO(),
            },
          });
          return user;
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      throw new ApolloError('User does not exist', '404');
    }
  }
  async verifyOtp(otp: number, userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    const currentTime = DateTime.utc().toSeconds();
    const expireTime = DateTime.fromISO(
      user.otp_exp_date.toISOString(),
    ).toSeconds();
    console.log(currentTime);
    console.log(expireTime);

    if (user.otp != otp) {
      throw new ApolloError('Incorrect OTP', '418');
      return false;
    }

    if (user.otp_exp_date != null && currentTime > expireTime) {
      await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          otp: null,
          otp_exp_date: null,
        },
      });

      console.log('otp expired');
      throw new ApolloError('OTP expired!', '404');
      return false;
    } else {
      await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          otp: null,
          otp_exp_date: null,
        },
      });

      console.log('user is verified!');
      return true;
    }
  }
}
