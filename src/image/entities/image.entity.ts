import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Beaf } from 'src/beaf/entities/beaf.entity';
import { Category } from 'src/CATEGORIES/category/entities/category.entity';
import { Feature } from 'src/CATEGORIES/feature/entities/feature.entity';
import { Option } from 'src/CATEGORIES/option/entities/option.entity';
import { Event } from 'src/event/entities/event.entity';

@ObjectType()
export class Image {
  @Field(() => Int)
  id: number;

  @Field(() => Int, { nullable: true })
  spotInLine: number;

  @Field(() => String, { nullable: true })
  location: string;

  @Field(() => String)
  link?: string;

  @Field(() => [Beaf])
  beafs?: [Beaf];

  @Field(() => Event)
  event?: Event;

  private _link?: Buffer;
}
