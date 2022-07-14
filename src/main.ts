import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { graphqlUploadExpress } from 'graphql-upload';
import { env } from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //app.use(graphqlUploadExpress());

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(env.PORT, () => {
    console.log(`
🚀 Server ready at: http://localhost:3000/graphql
⭐️ See sample queries: http://pris.ly/e/ts/graphql-nestjs#using-the-graphql-api
`);
  });
}
bootstrap();
