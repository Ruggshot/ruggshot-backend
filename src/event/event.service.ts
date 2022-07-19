import { Inject, Injectable } from '@nestjs/common';
import { Event } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class EventService {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

  async isUnique(
    first_name,
    last_name,
    zip_code,
    organizationId,
  ): Promise<Boolean> {
    const exists = await this.prismaService.event.findMany({
      where: {
        first_name: {
          equals: first_name,
          mode: 'insensitive',
        },
        last_name: {
          equals: last_name,
          mode: 'insensitive',
        },
        organizationId: organizationId,
        zip_code: zip_code,
      },
    });

    console.log('exists');
    console.log(exists.length);
    if (exists.length == 0) {
      return true;
    } else {
      return false;
    }
  }
}
