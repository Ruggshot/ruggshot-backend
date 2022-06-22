import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [EventResolver, EventService, PrismaService],
})
export class EventModule {}
