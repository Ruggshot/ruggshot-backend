import { Inject } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { PrismaService } from 'src/prisma.service';
import { CreateStoryInput } from './dto/create-story.input';
import { Story } from './entities/story.entity';

@Resolver(() => Story)
export class StoryResolver {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

  @ResolveField()
  beaf(@Root() story: Story): Promise<Story | null> {
    return this.prismaService.story
      .findUnique({
        where: {
          id: story.id,
        },
      })
      .beaf();
  }

  @Mutation(() => Story)
  createStory(
    @Args('data') data: CreateStoryInput,
    @Args('beafId') beafId: number,
    @Context() ctx,
  ): Promise<Story> {
    return this.prismaService.story.create({
      data: {
        story_description: data.story_description,
        beaf: {
          connect: { id: beafId },
        },
      },
    });
  }

  @Query(() => [Story], { name: 'allStories' })
  findAll(@Context() ctx) {
    return this.prismaService.story.findMany();
  }
}
