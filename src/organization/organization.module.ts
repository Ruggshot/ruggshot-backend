import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationResolver } from './organization.resolver';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [OrganizationResolver, OrganizationService, PrismaService],
})
export class OrganizationModule {}
