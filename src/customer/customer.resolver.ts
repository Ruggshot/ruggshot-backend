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
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';
import { Inject } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Organization } from '@prisma/client';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

  @ResolveField()
  async organizations(
    @Root() customer: Customer,
    @Context() ctx,
  ): Promise<Organization[]> {
    return this.prismaService.customer
      .findUnique({
        where: {
          id: customer.id,
        },
      })
      .organizations();
  }

  @Mutation(() => Customer)
  async createCustomer(
    @Args('data') data: CreateCustomerInput,
    @Context() ctx,
  ): Promise<Customer> {
    return this.prismaService.customer.create({
      data: data,
    });
  }

  @Query(() => [Customer], { name: 'allCustomers' })
  async findAll(@Context() ctx) {
    return this.prismaService.customer.findMany();
  }

  // @Query(() => Customer, { name: 'customer' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.customerService.findOne(id);
  // }

  // @Mutation(() => Customer)
  // updateCustomer(
  //   @Args('updateCustomerInput') updateCustomerInput: UpdateCustomerInput,
  // ) {
  //   return this.customerService.update(
  //     updateCustomerInput.id,
  //     updateCustomerInput,
  //   );
  // }

  // @Mutation(() => Customer)
  // removeCustomer(@Args('id', { type: () => Int }) id: number) {
  //   return this.customerService.remove(id);
  // }
}
