import { Inject } from '@nestjs/common';
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
import { env } from 'process';
import { PrismaService } from 'src/prisma.service';
import { CreateOptionInput } from './dto/create-option.input';
import { Option } from './entities/option.entity';
import { OptionService } from './option.service';

@Resolver(() => Option)
export class OptionResolver {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

  @ResolveField()
  async features(@Root() option: Option, @Context() ctx) {
    return this.prismaService.option
      .findUnique({
        where: {
          id: option.id,
        },
      })
      .features();
  }

  @ResolveField()
  async beafs(@Root() option: Option, @Context() ctx) {
    return this.prismaService.option
      .findUnique({
        where: {
          id: option.id,
        },
      })
      .beafs();
  }

  @Query(() => Option, { name: 'findOptionByID' })
  findOne(@Args('id', { type: () => Int }) id: number, @Context() ctx) {
    return this.prismaService.option.findUnique({
      where: {
        id: id,
      },
    });
  }

  @Query(() => [Option], { name: 'allOptions' })
  findAll(@Context() ctx) {
    return this.prismaService.option.findMany();
  }

  @Query(() => [Option], { name: 'allOptionsWhereParent' })
  findAllWhere(@Args('id', { type: () => Int }) id: number, @Context() ctx) {
    return this.prismaService.option.findMany({
      where: {
        parent_feat_id: id,
      },
    });
  }

  @Mutation(() => Option, { name: 'createOption' })
  createFeature(@Args('data') input: CreateOptionInput) {
    return this.prismaService.option.create({
      data: {
        option_name: input.option_name.toLowerCase(),
        parent_feat_id: input.parent_feat_id,
        features: {
          connect: [
            {
              id: input.parent_feat_id,
            },
          ],
        },
      },
    });
  }
}
