import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageResolver } from './image.resolver';
import { PrismaService } from 'src/prisma.service';
import { GraphQLModule } from '@nestjs/graphql';
import { Upload } from './Upload.scalar';
import { S3Service } from 'src/s3/s3.service';

@Module({
  imports: [],
  providers: [ImageResolver, ImageService, PrismaService, S3Service],
})
export class ImageModule {}
