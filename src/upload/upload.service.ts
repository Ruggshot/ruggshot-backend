import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Image } from '@prisma/client';
import { DateTime } from 'luxon';
import { env } from 'process';
import { PrismaService } from 'src/prisma.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class UploadService {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}
  async uploadImage(
    user: User,
    file: Express.Multer.File,
    eventId: string,
    beafIndex: string,
    spotInLine: string,
  ) {
    const activeUser = await this.prismaService.user.findUnique({
      where: { id: user.id },
    });
    const activeOrg = await this.prismaService.organization.findUnique({
      where: {
        id: activeUser.activeOrganization,
      },
      include: {
        customer: true,
        galleries: true,
      },
    });
    const activeEvent = await this.prismaService.event.findUnique({
      where: {
        id: parseInt(eventId),
      },
      include: { beafs: true },
    });

    const { fieldname, originalname, encoding, mimetype, buffer } = file;

    const s3Client = new S3Client({ region: env.AWS_REGION });

    const time = DateTime.now().toUTC().toFormat('X');

    const uploadParams = {
      Bucket: env.AWS_S3_BUCKET,
      Key: `${activeOrg.customer.name}/${activeOrg.name}/${eventId}/${time}-${originalname}`,
      Body: buffer,
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
        const beaf = await this.prismaService.beaf.create({
          data: {
            event: {
              connect: {
                id: activeEvent.id,
              },
            },
            gallery: {
              connect: {
                id: activeOrg.galleries[0].id,
              },
            },
          },
          include: {
            images: true,
          },
        });
        try {
          const image = await this.createImage(
            beaf.id,
            parseInt(spotInLine),
            saveLocation,
            activeEvent.id,
          );
          // this.findImageById(newImage.id); // <----- im pretty sure this is redundant

          console.log(
            `NEW beaf & Image was created : beafID: ${beaf.id} IMAGE id: ${image.id}`,
          );

          return { image, beaf };
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
          if (insertImage.images[parseInt(spotInLine)] != null) {
            const image = await this.updateImage(
              insertImage.images[parseInt(spotInLine)].id,
              saveLocation,
              parseInt(spotInLine),
            );

            const beaf = await this.prismaService.beaf.findUnique({
              where: {
                id: insertImage.id,
              },
              include: {
                images: true,
              },
            });
            this.findImageById(image.id);
            console.log(`Image was UPDATED: Image ID: ${image.id}`);
            return { image, beaf };
          } else {
            const image = await this.createImage(
              beaf.id,
              parseInt(spotInLine),
              saveLocation,
              parseInt(eventId),
            );

            const updatedBeaf = await this.prismaService.beaf.findUnique({
              where: {
                id: beaf.id,
              },
              include: {
                images: true,
              },
            });

            this.findImageById(image.id);
            console.log(`New Image created! Image ID: ${image.id}`);
            return { image, updatedBeaf };
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

  async createImage(
    beafId: number,
    spotInLine: number,
    location: string,
    eventId: number,
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
      include: {
        beafs: true,
      },
    });
  }

  updateImage(id: number, location: string, spotInLine: number) {
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

  findImageById(id: number) {
    return this.prismaService.image.findUnique({
      where: {
        id: id,
      },
    });
  }
}
