import { Inject, Post, Res, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Int,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { Category } from 'src/CATEGORIES/category/entities/category.entity';
import { PrismaService } from 'src/prisma.service';
import { CreateImageInput } from './dto/create-image.input';
import { Image } from './entities/image.entity';
import { ImageService } from './image.service';
import {
  FileUpload,
  GraphQLUpload,
  graphqlUploadExpress,
} from 'graphql-upload';
import { createReadStream, createWriteStream, ReadStream } from 'fs';
import { finished, Readable } from 'stream';
import { resolve } from 'path';
import { UploadImageInput } from './dto/upload-image.input';
import { ImageUploadType } from './entities/image-upload.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { S3Service } from 'src/s3/s3.service';
import { ConfigService } from '@nestjs/config';
import {
  GetObjectAttributesCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Event } from 'src/event/entities/event.entity';

@Resolver(() => Image)
export class ImageResolver {
  constructor(
    @Inject(PrismaService) private prismaService: PrismaService,
    @Inject(ImageService) private imageService: ImageService,
    private s3: S3Service,
  ) {}

  @ResolveField()
  event(@Root() image: Image) {
    return this.prismaService.image
      .findUnique({
        where: {
          id: image.id,
        },
      })
      .event();
  }

  @ResolveField()
  async beafs(@Root() image: Image, @Context() ctx) {
    return this.prismaService.image
      .findUnique({
        where: {
          id: image.id,
        },
      })
      .beafs();
  }

  // @Mutation(() => Boolean)
  // @UseGuards(JwtAuthGuard)
  // async singleUpload(
  //   @Args('file', { type: () => GraphQLUpload })
  //   file: FileUpload,
  //   @Context() ctx,
  // ) {
  //   const { filename, mimetype, encoding, createReadStream } = await file;
  //   console.log('file:', filename, mimetype, encoding);
  //   return new Promise(async (resolve, reject) =>
  //     createReadStream()
  //       .pipe(createWriteStream(`./uploads/${filename}`))
  //       .on('finish', () => resolve(true))
  //       .on('error', () => reject(false)),
  //   );
  // }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async singleUpload(
    @CurrentUser() user: User,
    @Args('file', { type: () => GraphQLUpload })
    file: FileUpload,
    @Args('eventId', { type: () => Int }) id: number,
    @Args('beafIndex', { type: () => Int }) beafIndex: number,
    @Args('spotInLine', { type: () => Int }) spotInLine: number,
    @Context() ctx,
  ) {
    return this.imageService.singleUpload(
      user,
      file,
      id,
      beafIndex,
      spotInLine,
      ctx,
    );
  }

  //   const s3Client = new S3Client({ region: 'eu-central-1' });
  //   const { filename, mimetype, encoding, createReadStream } = await file;

  //   const stream = createReadStream();
  //   const uploadParams = {
  //     Bucket: env.AWS_S3_BUCKET,
  //     Key: `orgName/eventNo/${filename}`,
  //     Body: stream,
  //     ContentType: mimetype,
  //   };

  //   const upload = new Upload({
  //     client: s3Client,
  //     params: uploadParams,
  //   });

  //   try {
  //     upload.on('httpUploadProgress', (progress) => {
  //       console.log(progress);
  //     });

  //     await upload.done();

  //     return true;
  //     // const data = await s3Client.send(new PutObjectCommand(uploadParams));
  //     // return data && true;
  //   } catch (error) {
  //     console.log(error);
  //     return false;
  //   }

  // CREATE IMAGE

  // @Mutation(() => Image)
  // createImage(
  //   @Args('data') data: CreateImageInput,
  //   @Context() ctx,
  // ): Promise<Image> {
  //   return this.prismaService.image.create({
  //     data: {
  //       beafs: {
  //         connect: {
  //           id: data.beafId,
  //         },
  //       },
  //       event: {
  //         connect: {
  //           id: data.eventId,
  //         },
  //       },
  //     },
  //   });
  // }

  // @Mutation(() => Image)
  // async updateImage(@Args('id', { type: () => Int }) id: number) {
  //   const currentImage = await this.prismaService.image.findUnique({
  //     where: { id },
  //   });

  //   return this.prismaService.image.update({
  //     where: { currentImage }
  // }

  @Query(() => [Image], { name: 'allImages' })
  findAll(@Context() ctx) {
    return this.prismaService.image.findMany();
  }
}
