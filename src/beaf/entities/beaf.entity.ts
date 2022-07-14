import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Feature } from 'src/CATEGORIES/feature/entities/feature.entity';
import { Option } from 'src/CATEGORIES/option/entities/option.entity';
import { Event } from 'src/event/entities/event.entity';
import { Gallery } from 'src/gallery/entities/gallery.entity';
import { Image } from 'src/image/entities/image.entity';
import { Story } from 'src/story/entities/story.entity';

@ObjectType()
export class Beaf {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Boolean)
  isCompleted: boolean;

  @Field(() => Gallery, { nullable: true })
  gallery?: Gallery;

  @Field(() => [Story], { nullable: true })
  stories?: [Story] | null;

  @Field(() => [Image], { nullable: true })
  images?: [Image];

  @Field(() => Event, { nullable: true })
  event?: Event;

  @Field(() => Number, { nullable: true })
  eventId?: number;

  @Field(() => Feature, { nullable: true })
  feature?: Feature;

  @Field(() => Int, { nullable: true })
  featureId?: number;

  @Field(() => [Option], { nullable: true })
  options?: [Option];

  @Field(() => Date)
  createdAt?: Date;

  @Field(() => Date)
  updatedAt?: Date;
}
