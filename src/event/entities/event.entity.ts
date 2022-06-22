import { Field, Int, ObjectType } from '@nestjs/graphql';
import 'reflect-metadata';
import { Beaf } from 'src/beaf/entities/beaf.entity';
import { Category } from 'src/CATEGORIES/category/entities/category.entity';
import { Image } from 'src/image/entities/image.entity';
import { Organization } from 'src/organization/entities/organization.entity';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class Event {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  first_name?: string;

  @Field(() => String)
  last_name: string;

  @Field(() => Int)
  zip_code: number;

  @Field(() => String)
  city: string;

  @Field(() => String)
  phone_number: string;

  @Field(() => String)
  status: string;

  @Field(() => Date)
  createdAt?: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => [Beaf])
  beafs?: [Beaf];

  @Field(() => [Image])
  images?: [Image];

  @Field(() => User)
  user?: User;

  @Field(() => Int)
  userId?: number;

  @Field(() => Organization)
  organization?: Organization;

  @Field(() => Int) // not sure about this one just want to make sure can call
  organizationId?: number;

  @Field(() => Category)
  category?: Category;

  @Field(() => Int)
  categoryId?: number;
}
