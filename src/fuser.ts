import 'reflect-metadata';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { Post } from './post';

@ObjectType()
export class FUser {
  @Field((type) => Int)
  id: number;

  @Field()
  @IsEmail()
  email: string;

  @Field((type) => String, { nullable: true })
  name?: string | null;

  @Field((type) => [Post], { nullable: true })
  posts?: [Post] | null;
}
