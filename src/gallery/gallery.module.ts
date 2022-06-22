import { Module } from '@nestjs/common';
// import { GalleryService } from './gallery.service';
import { GalleryResolver } from './gallery.resolver';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [GalleryResolver, PrismaService],
})
export class GalleryModule {}
