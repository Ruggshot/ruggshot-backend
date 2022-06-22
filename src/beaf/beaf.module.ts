import { Module } from '@nestjs/common';
import { BeafService } from './beaf.service';
import { BeafResolver } from './beaf.resolver';
import { PrismaService } from 'src/prisma.service';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [BeafResolver, BeafService, PrismaService, PrismaClient],
})
export class BeafModule {}
