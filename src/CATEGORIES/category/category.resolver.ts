import { ConsoleLogger, Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Int,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { PrismaService } from 'src/prisma.service';
import { Feature } from 'src/CATEGORIES/feature/entities/feature.entity';
import { CategoryService } from './category.service';
import { CreateCategoryInput } from './dto/create-category.input';
import { Category } from './entities/category.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { userInfo } from 'os';
import { User } from '@prisma/client';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

  // @ResolveField()
  // image

  @ResolveField()
  async events(@Root() category: Category, @Context() ctx) {
    return this.prismaService.category
      .findUnique({
        where: {
          id: category.id,
        },
      })
      .events();
  }

  @ResolveField()
  async features(@Root() category: Category, @Context() ctx) {
    return this.prismaService.category
      .findUnique({
        where: {
          id: category.id,
        },
      })
      .features();
  }

  @Mutation(() => Category)
  createCategory(@Args('data') input: CreateCategoryInput) {
    return this.prismaService.category.create({
      data: {
        category_name: input.category_name.toLowerCase(),
        description: input.description,
        image: input.image,
      },
    });
  }

  @Query(() => Category, { name: 'findCategoryById' })
  findOne(@Args('id', { type: () => Int }) id: number, @Context() ctx) {
    return this.prismaService.category.findUnique({
      where: {
        id: id,
      },
    });
  }

  @Query(() => [Category], { name: 'allCategories' })
  findAll(@Context() ctx) {
    return this.prismaService.category.findMany();
  }

  @Query(() => [Category], { name: 'allAssignedCategories' })
  @UseGuards(JwtAuthGuard)
  async findAssignedCategories(@CurrentUser() user: User, @Context() ctx) {
    const activeUser = await this.prismaService.user.findUnique({
      where: {
        id: user.id,
      },
    });

    const event = await this.prismaService.event.findMany({
      where: {
        organizationId: activeUser.activeOrganization,
      },
      include: {
        category: true,
      },
    });

    const uniqueCategories = [];

    event.forEach((element) => {
      if (!uniqueCategories.includes(element.category.id)) {
        uniqueCategories.push(element.category.id);
      }
    });

    return this.prismaService.category.findMany({
      where: {
        id: { in: uniqueCategories },
      },
    });
  }
}
