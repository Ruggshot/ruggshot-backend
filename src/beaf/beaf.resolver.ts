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
import { Feature, Option, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { Story } from 'src/story/entities/story.entity';
import { BeafService } from './beaf.service';
import { BeafUpdateInputDto } from './dto/update-beaf.input';
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
  feature(@Root() beaf: Beaf) {
    return this.prismaService.beaf
      .findUnique({
        where: {
          id: beaf.id,
        },
      })
      .Feature();
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

  @ResolveField()
  async options(@Root() beaf: Beaf, @Context() ctx) {
    return this.prismaService.beaf
      .findUnique({
        where: {
          id: beaf.id,
        },
      })
      .options();
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

  @Mutation(() => Beaf, { name: 'updateBeaf' })
  async updateBeaf(
    @Args('beafId') beafId: number,
    @Args('input') input: BeafUpdateInputDto,
    @Context() ctx,
  ) {
    // resets beaf options to null
    await this.prismaService.beaf.update({
      where: {
        id: beafId,
      },
      data: {
        options: {
          set: [],
        },
      },
    });

    const features = await this.prismaService.feature.findUnique({
      where: {
        id: input.featureId,
      },
      include: {
        options: true,
      },
    });

    const availableOptions = features.options.map(({ id }) => id);

    const optionsArray = [];

    input.options.forEach((element) => {
      if (availableOptions.includes(element)) {
        optionsArray.push(element);
      }
    });

    const updatedBeaf = this.prismaService.beaf.update({
      where: {
        id: beafId,
      },
      data: {
        featureId: input.featureId,
        options: {
          connect: optionsArray.map((int) => ({ id: int })),
        },
      },
    });

    if (input.description != null) {
      await this.prismaService.beaf.update({
        where: {
          id: beafId,
        },
        data: {
          description: input.description,
        },
      });
    }
    return updatedBeaf;
  }

  @Mutation(() => Beaf, { name: 'updateBeafFeature' })
  async updateFeature(
    @Args('beafId') beafId: number,
    @Args('input') input: BeafUpdateInputDto,
  ) {
    // resets beaf options to null
    await this.prismaService.beaf.update({
      where: {
        id: beafId,
      },
      data: {
        options: {
          set: [],
        },
      },
    });
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
      include: {
        Feature: true,
        options: true,
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
