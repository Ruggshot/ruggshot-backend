import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Beaf } from 'src/beaf/entities/beaf.entity';
import { Organization } from 'src/organization/entities/organization.entity';

@ObjectType()
export class Gallery {
  @Field(() => Int)
  id: number;

  @Field(() => Boolean)
  active: boolean;

  @Field(() => Organization)
  organization?: Organization;

  @Field(() => [Beaf])
  beafs?: [Beaf];
}
