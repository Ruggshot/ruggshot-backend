import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryResolver } from './story.resolver';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [StoryResolver, StoryService, PrismaService],
})
export class StoryModule {}
