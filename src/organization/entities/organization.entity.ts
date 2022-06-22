import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Customer } from 'src/customer/entities/customer.entity';
import { Event } from 'src/event/entities/event.entity';
import { Gallery } from 'src/gallery/entities/gallery.entity';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class Organization {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => Customer)
  customer?: Customer;

  @Field(() => [User])
  users?: [User];

  @Field(() => [Gallery])
  galleries?: [Gallery];

  @Field(() => [Event])
  events?: [Event];
}
