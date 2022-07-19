import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Root,
  Context,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Organization, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { Inject, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(
    @Inject(PrismaService) private prismaService: PrismaService,
    @Inject(UserService) private userService: UserService,
  ) {}

  @ResolveField()
  async organizations(@Root() user: User, @Context() ctx) {
    return this.prismaService.user
      .findUnique({
        where: {
          id: user.id,
        },
      })
      .organizations();
  }

  @ResolveField()
  async events(@Root() user: User, @Context() ctx) {
    return this.prismaService.user
      .findUnique({
        where: {
          id: user.id,
        },
      })
      .events();
  }

  // TEMPORARY REMOVAL in order to play with auth

  // @Mutation(() => User, { name: 'createUser' })
  // createUser(
  //   @Args('createUserInput') data: CreateUserInput,
  //   @Args('organizationId') organizationId: number,
  //   @Context() ctx,
  //   @Args('anotherOrgId') anotherId?: number,
  // ) {
  //   return this.userService.createUser(data, organizationId, ctx, anotherId);
  // }

  @Query(() => [User], { name: 'allUsers' })
  @UseGuards(JwtAuthGuard) // set to only admin
  async findAll(@Context() ctx) {
    console.log(ctx.req.user);
    return this.prismaService.user.findMany();
  }

  @Query(() => User, { name: 'findUserById' })
  @UseGuards(JwtAuthGuard)
  findUser(@CurrentUser() user: User) {
    console.log(user);
    return this.prismaService.user.findUnique({
      where: {
        id: user.id,
      },
    });
  }

  @Query(() => User, { name: 'findUserByNumber' })
  @UseGuards(JwtAuthGuard)
  findUserByNumber(@CurrentUser() user: User) {
    return this.userService.findOne(user.phone_number);
  }

  @Query(() => User, { name: 'findUserByToken' })
  @UseGuards(JwtAuthGuard)
  findUserByToken(@CurrentUser() user: User) {
    return this.userService.findOne(user.phone_number);
  }

  // Definitely don't need this
  // @Query(() => User, { name: 'findUserOrganizations' })
  // findUserOrg(@Args('id', { type: () => Int }) id: number, @Context() ctx) {
  //   return this.prismaService.user.findMany({
  //     where: {
  //       id: id,
  //     },
  //     select: {
  //       organizations: true,
  //     },
  //   });
  // }

  @Mutation(() => User)
  //@UseGuards(JwtAuthGuard)
  firstTimePassword(
    @Args('userId') userId: number,
    @Args('updateUserInput') data: UpdateUserInput,
  ) {
    return this.userService.firstTimePassword(userId, data);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  changePassword(
    @CurrentUser() user: User,
    @Args('updateUserInput') data: UpdateUserInput,
  ) {
    return this.userService.changePassword(user.id, data);
  }
  // @Mutation(() => User)
  // removeUser(@Args('id', { type: () => Int }) id: number) {
  //   return this.userService.remove(id);
  // }
}
