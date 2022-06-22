import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import { Args, Context } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import * as bcrpyt from 'bcrypt';

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
      return newUser;
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

  async update(userId: number, data: UpdateUserInput) {
    var hashedPassword;
    if (data.password) {
      hashedPassword = await bcrpyt.hash(data.password, 10);
    }
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
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
