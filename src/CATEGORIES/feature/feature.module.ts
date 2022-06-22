import { Module } from '@nestjs/common';
import { FeatureService } from './feature.service';
import { FeatureResolver } from './feature.resolver';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [FeatureResolver, FeatureService, PrismaService],
})
export class FeatureModule {}
