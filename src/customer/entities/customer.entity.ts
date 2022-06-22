import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Organization } from 'src/organization/entities/organization.entity';

@ObjectType()
export class Customer {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => [Organization], { nullable: true })
  organizations?: [Organization] | null;
}
