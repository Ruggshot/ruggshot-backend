import { Inject } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma.service';
import { AdminService } from './admin.service';

@Resolver()
export class AdminResolver {
  constructor(
    private readonly adminService: AdminService,
    @Inject(PrismaService) private prismaService: PrismaService,
  ) {}

  // async validateAdmin(email: string, password: string): Promise<any> {

  //   const admin = await this.prismaService.admin.findUnique({
  //     where: {
  //       email:  email,
  //     },
  // }
}
