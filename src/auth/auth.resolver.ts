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

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Mutation(() => LoginResponse, { name: 'loginUser' })
  @UseGuards(GqlAuthGuard)
  login(
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
  @UseGuards(JwtAuthGuard)
  isAuthorized() {
    return true;
  }
}
