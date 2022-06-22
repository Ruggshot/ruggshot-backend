import { Inject, Res } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { Story } from 'src/story/entities/story.entity';
import { BeafService } from './beaf.service';
import { Beaf } from './entities/beaf.entity';

@Resolver(() => Beaf)
export class BeafResolver {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

  @ResolveField()
  event(@Root() beaf: Beaf) {
    return this.prismaService.beaf
      .findUnique({
        where: {
          id: beaf.id,
        },
      })
      .event();
  }

  @ResolveField()
  gallery(@Root() beaf: Beaf) {
    return this.prismaService.beaf
      .findUnique({
        where: {
          id: beaf.id,
        },
      })
      .gallery();
  }

  @ResolveField()
  async stories(@Root() beaf: Beaf, @Context() ctx): Promise<Story[]> {
    return this.prismaService.beaf
      .findUnique({
        where: {
          id: beaf.id,
        },
      })
      .stories();
  }

  @ResolveField()
  async images(@Root() beaf: Beaf, @Context() ctx) {
    return this.prismaService.beaf
      .findUnique({
        where: {
          id: beaf.id,
        },
      })
      .images();
  }

  @Mutation(() => Beaf)
  async createBeaf(
    @Args('eventId') eventId: number,
    @Context() ctx,
  ): Promise<Beaf> {
    return this.prismaService.beaf.create({
      data: {
        event: {
          connect: { id: eventId },
        },
      },
    });
  }
  @Query(() => [Beaf], { name: 'allBeafs' })
  findAll(@Context() ctx) {
    this.prismaService.beaf.findMany();
  }

  @Query(() => Beaf, { name: 'findBeafById' })
  async findOne(@Args('beafId') beafId: number, @Context() ctx) {
    const beaf = await this.prismaService.beaf.findMany({
      where: {
        id: beafId,
      },
      select: {
        _count: {
          select: { images: true },
        },
      },
    });

    console.log(beaf[0]._count.images);
    return this.prismaService.beaf.findUnique({
      where: {
        id: beafId,
      },
    });
  }

  @Query(() => [Beaf], { name: 'getEventBeafs' })
  getEventBeafs(@Args('eventId') eventId: number, @Context() ctx) {
    return this.prismaService.beaf.findMany({
      where: {
        eventId: eventId,
      },
    });
  }
}
