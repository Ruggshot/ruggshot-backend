import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerResolver } from './customer.resolver';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [CustomerResolver, CustomerService, PrismaService],
})
export class CustomerModule {}
