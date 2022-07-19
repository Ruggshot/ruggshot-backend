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
import { OrganizationService } from './organization.service';
import { Organization } from './entities/organization.entity';
import { CreateOrganizationInput } from './dto/create-organization.input';
import { UpdateOrganizationInput } from './dto/update-organization.input';
import { PrismaService } from 'src/prisma.service';
import { Inject, Res, UseGuards } from '@nestjs/common';
import { Customer, Gallery, User } from '@prisma/client';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Resolver(() => Organization)
export class OrganizationResolver {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

  @ResolveField()
  customer(@Root() organization: Organization): Promise<Customer | null> {
    return this.prismaService.organization
      .findUnique({
        where: {
          id: organization.id,
        },
      })
      .customer();
  }

  @ResolveField()
  async events(@Root() organzation: Organization, @Context() ctx) {
    return this.prismaService.organization
      .findUnique({
        where: {
          id: organzation.id,
        },
      })
      .events();
  }

  @ResolveField()
  async users(@Root() organization: Organization, @Context() ctx) {
    return this.prismaService.organization
      .findUnique({
        where: {
          id: organization.id,
        },
      })
      .users();
  }

  @ResolveField()
  async galleries(
    @Root() organization: Organization,
    @Context() ctx,
  ): Promise<Gallery[]> {
    return this.prismaService.organization
      .findUnique({
        where: {
          id: organization.id,
        },
      })
      .galleries();
  }

  @Mutation(() => Organization)
  async createOrganization(
    @Args('data')
    data: CreateOrganizationInput,
    @Args('customerId') customerId: number,
    @Context() ctx,
    @Args('users') userId?: number,
  ): Promise<Organization> {
    const newOrg = await this.prismaService.organization.create({
      data: {
        name: data.name,
        customer: {
          connect: { id: customerId },
        },
      },
    });
    try {
      await this.prismaService.gallery.create({
        data: {
          organizationId: newOrg.id,
        },
      });
    } catch (error) {
      console.log(error);
    }
    return newOrg;
  }

  @Query(() => [Organization], { name: 'allOrganizations' })
  findAll(@Context() ctx) {
    return this.prismaService.organization.findMany();
  }

  @Query(() => Organization, { name: 'organization' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.prismaService.organization.findUnique({
      where: { id },
    });
  }

  @Query(() => Organization, { name: 'findUsersInOrg' })
  @UseGuards(JwtAuthGuard)
  async findUsersInOrg(@CurrentUser() user: User) {
    const activeUser = await this.prismaService.user.findUnique({
      where: { id: user.id },
    });

    console.log(activeUser);
    const org = this.prismaService.organization.findUnique({
      where: {
        id: activeUser.activeOrganization,
      },
    });
    return org;
  }

  // @Mutation(() => Organization)
  // updateOrganization(
  //   @Args('updateOrganizationInput')
  //   updateOrganizationInput: UpdateOrganizationInput,
  // ) {
  //   return this.organizationService.update(
  //     updateOrganizationInput.id,
  //     updateOrganizationInput,
  //   );
  // }

  // @Mutation(() => Organization)
  // removeOrganization(@Args('id', { type: () => Int }) id: number) {
  //   return this.organizationService.remove(id);
  // }
}
