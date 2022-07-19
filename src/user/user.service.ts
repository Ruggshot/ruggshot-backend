import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import { Args, Context } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import * as bcrpyt from 'bcrypt';
import { ApolloError } from 'apollo-server-express';

@Injectable()
export class UserService {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

  async createUser(
    @Args('createUserInput') data: CreateUserInput,
    @Args('organizationId') organizationId: number,
    @Context() ctx,
    @Args('anotherOrgId') anotherId?: number,
  ) {
    var hashedPassword;

    if (data.password != null) {
      hashedPassword = await bcrpyt.hash(data.password, 10);
    } else {
      hashedPassword = null;
    }

    try {
      const newUser = await this.prismaService.user.create({
        data: {
          name: data.name,
          phone_number: data.phone_number,
          password: hashedPassword,

          // assumes whatever org user is added to, to be active urrent org
          activeOrganization: organizationId,
          organizations: {
            connect: [
              {
                id: organizationId,
              },
              {
                // need to change this later for accepting a dynamic amount of org IDs

                id: anotherId,
              },
            ],
          },
        },
      });
      const { password, ...result } = newUser;
      return result;
    } catch (error) {
      if (error.code === 'P2002') {
        Logger.log('User already exists!');
        throw new ConflictException('User with number already exists');
      }
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(phone_number: string) {
    return this.prismaService.user.findUnique({
      where: {
        phone_number: phone_number,
      },
    });
  }

  async firstTimePassword(userId: number, data: UpdateUserInput) {
    var hashedPassword;

    const activeUser = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (data.password) {
      hashedPassword = await bcrpyt.hash(data.password, 10);
    }

    if (activeUser.numberVerified) {
      return this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          name: data.name,
          activeOrganization: data.activeOrganization,
          phone_number: data.phone_number,
          password: hashedPassword,
        },
      });
    } else {
      throw new ApolloError(
        'User has not yet registered. Please Contact your team leader.',
      );
    }
  }

  async changePassword(userId: number, data: UpdateUserInput) {
    return this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        password: data.password,
      },
    });
  }
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
