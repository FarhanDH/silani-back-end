import {
  Controller,
  Delete,
  Param,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async upload(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|svg|tiff|webp|gif)$/,
        })
        .addMaxSizeValidator({ maxSize: 1000000 })
        .build({ fileIsRequired: false }),
    )
    image: Express.Multer.File,
  ) {
    const uploaded = this.storageService.upload(
      image.originalname,
      image.buffer,
      image.mimetype,
    );
    return uploaded;
  }

  @Delete(':key')
  async delete(@Param('key') key: string) {
    const deleted = this.storageService.delete(key);
    return deleted;
  }
}
