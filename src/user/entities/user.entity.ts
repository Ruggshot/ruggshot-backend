import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { Event } from 'src/event/entities/event.entity';
import { Organization } from 'src/organization/entities/organization.entity';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  phone_number: string;

  @Field(() => String, { nullable: true })
  password: string;

  @Field(() => Boolean)
  orgVerified: Boolean;

  @Field(() => Boolean)
  numberVerified: Boolean;

  @Field(() => [Organization])
  organizations: [Organization];

  @Field(() => [Event], { nullable: true })
  events?: [Event];

  @Field(() => Int, { nullable: true })
  activeOrganization?: number;

  @Field(() => Date)
  createdAt: Date;
}
