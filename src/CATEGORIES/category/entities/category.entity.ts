import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsLowercase } from 'class-validator';
import { Feature } from 'src/CATEGORIES/feature/entities/feature.entity';
import { Event } from 'src/event/entities/event.entity';
import { Image } from 'src/image/entities/image.entity';

@ObjectType()
export class Category {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  category_name: String;

  @Field(() => String, { nullable: true })
  description?: String;

  @Field(() => String, { nullable: true })
  image?: String;

  @Field(() => Boolean)
  active: Boolean;

  @Field(() => [Feature], { nullable: true }) // also null while creating
  features?: [Feature];

  @Field(() => [Event], { nullable: true })
  events?: [Event];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
