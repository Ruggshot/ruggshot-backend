import 'reflect-metadata';
import { Inject, UseGuards } from '@nestjs/common';
import {
  Context,
  ResolveField,
  Resolver,
  Root,
  Query,
  Mutation,
  Args,
  InputType,
  Field,
  registerEnumType,
  Int,
  CONTEXT,
} from '@nestjs/graphql';
import { Category, Prisma } from '@prisma/client';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Organization } from 'src/organization/entities/organization.entity';
import { PrismaService } from 'src/prisma.service';
import { User } from 'src/user/entities/user.entity';
import { CreateEventInput } from './dto/create-event.input';
import { Event } from './entities/event.entity';
import { EventService } from './event.service';

enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}

@Resolver(() => Event)
export class EventResolver {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

  @ResolveField()
  category(@Root() event: Event): Promise<Category | null> {
    return this.prismaService.event
      .findUnique({
        where: {
          id: event.id,
        },
      })
      .category();
  }

  @ResolveField()
  organization(@Root() event: Event): Promise<Organization | null> {
    return this.prismaService.event
      .findUnique({
        where: {
          id: event.id,
        },
      })
      .organization();
  }

  @ResolveField()
  user(@Root() event: Event) {
    return this.prismaService.event
      .findUnique({
        where: {
          id: event.id,
        },
      })
      .user();
  }

  @ResolveField()
  async images(@Root() event: Event, @Context() ctx) {
    return this.prismaService.event
      .findUnique({
        where: {
          id: event.id,
        },
      })
      .images();
  }

  @ResolveField()
  async beafs(@Root() event: Event, @Context() ctx) {
    return this.prismaService.event
      .findUnique({
        where: {
          id: event.id,
        },
      })
      .beafs();
  }

  @Query(() => [Event], { name: 'allEvents' })
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Args('orderBy', { nullable: true })
    orderBy: SortOrder,
    @Args('skip', { nullable: true }) skip: number,
    @Args('take', { nullable: true }) take: number,
    @Args('status', { nullable: true }) status: string,
    @Args('zipCode', { nullable: true }) zip_code: string,
    @Args('firstName', { nullable: true }) first_name: string,
    @Args('lastName', { nullable: true }) last_name: string,
    @Args('categoryId', { nullable: true }) category: number,
    @CurrentUser() user: User,
    @Context() ctx,
  ) {
    if (!isNaN(Number(zip_code))) {
      var intZip = Number(zip_code);
    } else {
      intZip = null;
    }
    const activeUser = await this.prismaService.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        organizations: true,
      },
    });
    const events = await this.prismaService.event.findMany({
      orderBy: {
        first_name: SortOrder.asc,
      },
      where: {
        status: status,
        zip_code: intZip || undefined,
        first_name: first_name || undefined,
        last_name: last_name || undefined,
        id: category || undefined,
        organizationId: activeUser.activeOrganization,
      },
    });

    return events;
  }

  @Query(() => Event, { name: 'findEventById' })
  //@UseGuards(JwtAuthGuard)
  findEvent(@Args('eventId') id: number, @Context() ctx) {
    return this.prismaService.event.findUnique({
      where: {
        id: id,
      },
    });
  }

  // User sets the org, because event creation is done within context of current users org
  @Mutation(() => Event, { name: 'createEvent' })
  @UseGuards(JwtAuthGuard)
  async createEvent(
    @CurrentUser() user: User,
    @Args('data') data: CreateEventInput,
    @Context() ctx,
  ): Promise<Event> {
    // Creates new event & Beaf, connects Beaf to event
    const activeUser = await this.prismaService.user.findUnique({
      where: {
        id: user.id,
      },
    });
    const activeOrg = await this.prismaService.organization.findUnique({
      where: {
        id: activeUser.activeOrganization,
      },
      include: { galleries: true },
    });

    console.log(activeUser.activeOrganization);
    try {
      const newEvent = await this.prismaService.event.create({
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          zip_code: data.zip_code,
          city: data.city,
          phone_number: data.phone_number,
          status: 'DRAFT',
          user: {
            connect: {
              id: activeUser.id,
            },
          },

          organization: {
            connect: {
              id: activeUser.activeOrganization,
            },
          },

          category: {
            connect: {
              id: data.categoryId,
            },
          },
        },
      });
      // try {
      //   await this.prismaService.beaf.create({
      //     data: {
      //       event: {
      //         connect: {
      //           id: newEvent.id,
      //         },
      //       },
      //       gallery: {
      //         connect: {
      //           id: activeOrg.galleries[0].id,
      //         },
      //       },
      //     },
      //   });
      // } catch (error) {
      //   console.log(error);
      // }
      return newEvent;
    } catch (error) {
      console.log(error);
    }
  }

  @Mutation(() => Event, { name: 'updateEvent' })
  //@UseGuards(JwtAuthGuard)
  async updateEvent(
    @Context() ctx,
    @Args('eventId') id: number,
    @Args('eventStatus', { nullable: true }) status?: string,
    @Args('firstName', { nullable: true }) first_name?: string,
    @Args('lastName', { nullable: true }) last_name?: string,
    @Args('zipCode', { nullable: true }) zip_code?: string,
    @Args('phoneNumber', { nullable: true }) phone_number?: string,
    @Args('categoryId', { nullable: true }) category?: number,
  ) {
    const activeEvent = await this.prismaService.event.findUnique({
      where: {
        id: id,
      },
    });

    const zip = parseInt(zip_code, 10);
    return this.prismaService.event.update({
      where: {
        id: activeEvent.id,
      },
      data: {
        status: status,
        first_name: first_name,
        last_name: last_name,
        zip_code: zip || undefined,
        phone_number: phone_number,
        categoryId: category,
      },
    });
  }
}
