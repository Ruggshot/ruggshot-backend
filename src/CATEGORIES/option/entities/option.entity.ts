import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Beaf } from 'src/beaf/entities/beaf.entity';
import { Feature } from 'src/CATEGORIES/feature/entities/feature.entity';

@ObjectType()
export class Option {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  option_name: String;

  @Field(() => Boolean)
  active: boolean;

  @Field(() => [Beaf])
  beafs?: [Beaf];

  @Field(() => Int) // NOT NULL EVER (unique on schema)
  parent_feat_id: number;

  @Field(() => [Feature])
  features?: [Feature];
}
