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
    TwilioModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (cfg: ConfigService) => ({
        accountSid: cfg.get('TWILIO_ACCOUNT_SID'),
        authToken: cfg.get('TWILIO_AUTH_TOKEN'),
      }),
      inject: [ConfigService],
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
  providers: [PrismaService, EventResolver, S3Service],
})
export class AppModule {}
