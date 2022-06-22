import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Category } from 'src/CATEGORIES/category/entities/category.entity';
import { Option } from 'src/CATEGORIES/option/entities/option.entity';

@ObjectType()
export class Feature {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  feature_name: String;

  @Field(() => Boolean)
  active: boolean;

  @Field(() => Int) // NOT NULL EVER (unique on schema)
  parent_cat_id: number;

  @Field(() => [Category])
  categories?: [Category];

  @Field(() => [Option], { nullable: true }) // nullable while creating most likely
  options?: [Option];
}
