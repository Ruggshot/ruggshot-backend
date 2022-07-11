import { HttpException, HttpStatus, Inject, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { DateTime } from 'luxon';
import { use } from 'passport';
import { PrismaService } from 'src/prisma.service';
import { CreateUserInput } from 'src/user/dto/create-user.input';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response';
import { LoginUserInput } from './dto/login-user.input';
import { UserNumber } from './entities/user-number.entity';
import { GqlAuthGuard } from './gql-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApolloError } from 'apollo-server-express';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Mutation(() => LoginResponse, { name: 'loginUser' })
  @UseGuards(GqlAuthGuard)
  async login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
    @Context() context,
  ) {
    return this.authService.login(context.user);
  }

  @Mutation(() => User)
  async signup(
    @Args('createUserInput') data: CreateUserInput,
    @Args('organizationId') organizationId: number,
    @Context() ctx,
    @Args('anotherOrgId') anotherId?: number,
  ) {
    return this.userService.createUser(data, organizationId, ctx, anotherId);
  }

  // Sends OTP for number verification if User exists
  @Query(() => User)
  async verifyUserExists(
    @Args('phone_number', { type: () => String }) phone_number: string,
  ) {
    return this.authService.findUser(phone_number);
  }

  @Query(() => Boolean)
  async verifyOTP(
    @Args('otp') otp: number,
    @Args('userId') userId: number,
  ): Promise<Boolean> {
    return this.authService.verifyOtp(otp, userId);
  }

  @Query(() => Boolean)
  async sendOrgOTP(
    @Args('phone_number', { type: () => String }) phone_number: string,
  ): Promise<Boolean> {
    return this.authService.sendOrgOTP(phone_number);
  }

  @Query(() => Boolean)
  async verifyOrgOTP(
    @Args('otp') otp: number,
    @Args('phoneNumber') phone_number: string,
  ): Promise<Boolean> {
    return this.authService.verifyOrgOTP(otp, phone_number);
  }

  @Query(() => Boolean)
  @UseGuards(JwtAuthGuard)
  isAuthorized() {
    return true;
  }
}
