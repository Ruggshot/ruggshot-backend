import { Module } from '@nestjs/common';
import { OptionService } from './option.service';
import { OptionResolver } from './option.resolver';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [OptionResolver, OptionService, PrismaService],
})
export class OptionModule {}
