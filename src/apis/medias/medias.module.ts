import { Module } from '@nestjs/common';
import { MediasController } from './medias.controller';
import { MediasService } from './medias.service';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { FileSchema } from './entities/medias.entity';
import { CloudinaryService } from 'src/packages/cloudinary/cloudinary.service';
import { UploadFileEvent } from 'src/cores/event-handler/files/upload-file.event';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: COLLECTION_NAME.FILE,
          schema: FileSchema,
        }
      ]
    )
  ],
  controllers: [MediasController],
  providers: [
    MediasService,
    CloudinaryService,
    UploadFileEvent
  ],
  exports: [
    MediasService,
  ]
})
export class MediasModule { }
