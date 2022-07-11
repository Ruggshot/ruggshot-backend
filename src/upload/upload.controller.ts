import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Args, Int } from '@nestjs/graphql';
import { Multer } from 'multer';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image-upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Body('eventId') eventId: string,
    @Body('beafIndex') beafIndex: string,
    @Body('spotInLine') spotInLine: string,
  ) {
    console.log(user, eventId, beafIndex, spotInLine);

    return this.uploadService.uploadImage(
      user,
      file,
      eventId,
      beafIndex,
      spotInLine,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  findAll(@GetUser() user: User, @Request() req) {
    console.log(user);
    return user;
  }
}
