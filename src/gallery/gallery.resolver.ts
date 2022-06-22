import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Root,
  Context,
} from '@nestjs/graphql';
import { Gallery } from './entities/gallery.entity';
import { CreateGalleryInput } from './dto/create-gallery.input';
import { Inject } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Organization } from '@prisma/client';

@Resolver(() => Gallery)
export class GalleryResolver {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

  @ResolveField()
  organization(@Root() gallery: Gallery): Promise<Organization | null> {
    return this.prismaService.gallery
      .findUnique({
        where: {
          id: gallery.id,
        },
      })
      .organization();
  }

  @ResolveField()
  async beafs(@Root() gallery: Gallery, @Context() ctx) {
    return this.prismaService.gallery
      .findUnique({
        where: {
          id: gallery.id,
        },
      })
      .beafs();
  }

  @Mutation(() => Gallery)
  createGallery(
    @Args('organizationId') organizationId: number,
    @Context() ctx,
  ): Promise<Gallery> {
    return this.prismaService.gallery.create({
      data: {
        organization: {
          connect: { id: organizationId },
        },
      },
    });
  }

  @Query(() => [Gallery], { name: 'allGalleries' })
  findAll() {
    return this.prismaService.gallery.findMany();
  }

  // @Query(() => Gallery, { name: 'gallery' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.galleryService.findOne(id);
  // }

  // @Mutation(() => Gallery)
  // updateGallery(@Args('updateGalleryInput') updateGalleryInput: UpdateGalleryInput) {
  //   return this.galleryService.update(updateGalleryInput.id, updateGalleryInput);
  // }

  // @Mutation(() => Gallery)
  // removeGallery(@Args('id', { type: () => Int }) id: number) {
  //   return this.galleryService.remove(id);
}
