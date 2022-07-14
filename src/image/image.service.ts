import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Args, Context } from '@nestjs/graphql';
import { FileUpload } from 'graphql-upload';
import { DateTime } from 'luxon';
import { env } from 'process';
import { Event } from 'src/event/entities/event.entity';
import { PrismaService } from 'src/prisma.service';
import { User } from 'src/user/entities/user.entity';
import { CreateImageInput } from './dto/create-image.input';
import { Image } from './entities/image.entity';

@Injectable()
export class ImageService {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

  async singleUpload(
    user: User,
    file: FileUpload,
    id: number,
    beafIndex: number,
    spotInLine: number,
    ctx,
  ) {
    console.log(id);
    const activeUser = await this.prismaService.user.findUnique({
      where: { id: user.id },
    });
    const activeOrg = await this.prismaService.organization.findUnique({
      where: {
        id: activeUser.activeOrganization,
      },
      include: {
        customer: true,
      },
    });
    const activeEvent = await this.prismaService.event.findUnique({
      where: {
        id: id,
      },
      include: { beafs: true },
    });

    console.log(`customer : ${activeOrg.customer.name}`);
    const s3Client = new S3Client({ region: env.AWS_REGION });
    const { filename, mimetype, encoding, createReadStream } = await file;

    const time = DateTime.now().toUTC().toFormat('X');

    const stream = createReadStream();
    const uploadParams = {
      Bucket: env.AWS_S3_BUCKET,
      Key: `${activeOrg.customer.name}/${activeOrg.name}/${id}/${time}-${filename}`,
      Body: stream,
      ContentType: mimetype,
    };

    const upload = new Upload({
      client: s3Client,
      params: uploadParams,
    });

    try {
      upload.on('httpUploadProgress', (progress) => {
        console.log(progress);
      });

      await upload.done();

      const location = uploadParams.Key.replaceAll(' ', '+');
      const saveLocation = `${env.S3_DEV_URL}${location}`;

      if (activeEvent?.beafs[beafIndex] == null) {
        var newBeaf = await this.prismaService.beaf.create({
          data: {
            event: {
              connect: {
                id: activeEvent.id,
              },
            },
          },
        });
        try {
          const newImage = await this.createImage(
            newBeaf.id,
            spotInLine,
            saveLocation,
            activeEvent.id,
            ctx,
          );
          this.findImageById(newImage.id);
          return newImage.id, true;
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          const beaf = activeEvent.beafs[beafIndex];
          console.log(beaf.id);
          var insertImage = await this.prismaService.beaf.findUnique({
            where: {
              id: beaf.id,
            },
            include: { images: true },
          });

          console.log(insertImage.images);
          if (insertImage.images[spotInLine] != null) {
            const updatedImage = await this.updateImage(
              insertImage.images[spotInLine].id,
              saveLocation,
              spotInLine,
            );

            this.findImageById(updatedImage.id);
            return true;
          } else {
            const newImage = await this.createImage(
              beaf.id,
              spotInLine,
              saveLocation,
              id,
              ctx,
            );

            this.findImageById(newImage.id);
            console.log(`Image ID: ${newImage.id}`);
            return true;
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
      return false;
    }
    return true;
  }

  createImage(
    @Args('beafId') beafId: number,
    @Args('spotInLine') spotInLine: number,
    @Args('saveLocation') location: string,
    @Args('eventId') eventId: number,
    @Context() ctx,
  ): Promise<Image> {
    return this.prismaService.image.create({
      data: {
        beafs: {
          connect: {
            id: beafId,
          },
        },
        spotInLine: spotInLine,
        location: location,
        event: {
          connect: {
            id: eventId,
          },
        },
      },
    });
  }

  updateImage(
    @Args('imageId') id: number,
    @Args('saveLocation') location: string,
    @Args('spotInLine') spotInLine: number,
  ) {
    return this.prismaService.image.update({
      where: {
        id: id,
      },
      data: {
        location: location,
        spotInLine: spotInLine,
      },
    });
  }

  findImageById(@Args('imageId') id: number) {
    return this.prismaService.image.findUnique({
      where: {
        id: id,
      },
    });
  }
}
