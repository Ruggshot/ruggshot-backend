import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { PrismaService } from './prisma.service';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { OrganizationModule } from './organization/organization.module';
import { CustomerModule } from './customer/customer.module';
import { UserModule } from './user/user.module';
import { GalleryModule } from './gallery/gallery.module';
import { BeafModule } from './beaf/beaf.module';
import { StoryModule } from './story/story.module';
import { ImageModule } from './image/image.module';
import { CategoryModule } from './CATEGORIES/category/category.module';
import { OptionModule } from './CATEGORIES/option/option.module';
import { EventModule } from './event/event.module';
import { AuthModule } from './auth/auth.module';
import { TwilioModule } from 'nestjs-twilio';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FeatureModule } from './CATEGORIES/feature/feature.module';
import { EventResolver } from './event/event.resolver';
import { S3Service } from './s3/s3.service';
import { UploadModule } from './upload/upload.module';
import { env } from 'process';
import { EventService } from './event/event.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      buildSchemaOptions: { dateScalarMode: 'timestamp' },
      debug: false,
      cors: true,
      //resolvers: { Upload: GraphQLUpload },
    }),
    TwilioModule.forRoot({
      accountSid: env.TWILIO_ACCOUNT_SID,
      authToken: env.TWILIO_AUTH_TOKEN,
    }),
    OrganizationModule,
    CustomerModule,
    UserModule,
    GalleryModule,
    BeafModule,
    StoryModule,
    ImageModule,
    CategoryModule,
    OptionModule,
    EventModule,
    AuthModule,
    FeatureModule,
    UploadModule,
  ],
  controllers: [],
  providers: [PrismaService, EventResolver, S3Service, EventService],
})
export class AppModule {}
