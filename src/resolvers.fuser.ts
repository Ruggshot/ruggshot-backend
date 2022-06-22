import 'reflect-metadata';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  ResolveField,
  Root,
  InputType,
  Field,
} from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { Post } from './post';
import { FUser } from './fuser';
import { PrismaService } from './prisma.service';
import { PostCreateInput } from './resolvers.post';

@InputType()
class FUserUniqueInput {
  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  email: string;
}

@InputType()
class FUserCreateInput {
  @Field()
  email: string;

  @Field({ nullable: true })
  name: string;

  @Field((type) => [PostCreateInput], { nullable: true })
  posts: [PostCreateInput];
}

@Resolver(FUser)
export class FUserResolver {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

  @ResolveField()
  async posts(@Root() fuser: FUser, @Context() ctx): Promise<Post[]> {
    return this.prismaService.fUser
      .findUnique({
        where: {
          id: fuser.id,
        },
      })
      .posts();
  }

  @Mutation((returns) => FUser)
  async signupFUser(
    @Args('data') data: FUserCreateInput,
    @Context() ctx,
  ): Promise<FUser> {
    const postData = data.posts?.map((post) => {
      return { title: post.title, content: post.content || undefined };
    });

    return this.prismaService.fUser.create({
      data: {
        email: data.email,
        name: data.name,
        posts: {
          create: postData,
        },
      },
    });
  }

  @Query((returns) => [FUser], { nullable: true })
  async allFUsers(@Context() ctx) {
    return this.prismaService.fUser.findMany();
  }

  @Query((returns) => [Post], { nullable: true })
  async draftsByFUser(
    @Args('fuserUniqueInput') fuserUniqueInput: FUserUniqueInput,
  ): Promise<Post[]> {
    return this.prismaService.fUser
      .findUnique({
        where: {
          id: fuserUniqueInput.id || undefined,
          email: fuserUniqueInput.email || undefined,
        },
      })
      .posts({
        where: {
          published: false,
        },
      });
  }
}
