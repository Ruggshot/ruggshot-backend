import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Beaf } from 'src/beaf/entities/beaf.entity';

@ObjectType()
export class Story {
  @Field(() => Int)
  id: number;

  @Field(() => Beaf)
  beaf?: Beaf;

  @Field(() => String)
  story_description?: string;
}
