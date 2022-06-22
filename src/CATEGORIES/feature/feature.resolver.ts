import { Inject } from '@nestjs/common';
import {
  Args,
  CONTEXT,
  Context,
  Int,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { PrismaService } from 'src/prisma.service';
import { CreateFeatureInput } from './dto/create-feature.input';
import { Feature } from './entities/feature.entity';
import { FeatureService } from './feature.service';

@Resolver(() => Feature)
export class FeatureResolver {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

  @ResolveField()
  async categories(@Root() feature: Feature, @Context() ctx) {
    return this.prismaService.feature
      .findUnique({
        where: {
          id: feature.id,
        },
      })
      .categories();
  }

  // commenting out for now to make sure parent child relation is good

  // @ResolveField()
  // async options(@Root() feature: Feature, @Context() ctx){
  //   return this.prismaService.feature.findUnique({
  //     where: {
  //       id: feature.id
  //     }
  //   })
  //   .options()
  // }

  @Query(() => Feature, { name: 'findFeatureById' })
  findOne(@Args('id', { type: () => Int }) id: number, @Context() ctx) {
    return this.prismaService.feature.findUnique({
      where: {
        id: id,
      },
    });
  }

  @Query(() => [Feature], { name: 'allFeatures' })
  findAll(@Context() ctx) {
    return this.prismaService.feature.findMany();
  }

  @Mutation(() => Feature, { name: 'createFeature' })
  createFeature(@Args('data') input: CreateFeatureInput) {
    return this.prismaService.feature.create({
      data: {
        feature_name: input.feature_name.toLowerCase(),
        parent_cat_id: input.parent_cat_id,
        categories: {
          connect: [
            {
              id: input.parent_cat_id,
            },
          ],
        },
      },
    });
  }
}
