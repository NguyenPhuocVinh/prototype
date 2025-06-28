import { Module } from '@nestjs/common';
import { MediasController } from './medias.controller';
import { MediasService } from './medias.service';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { MediaSchema } from './entities/medias.entity';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: COLLECTION_NAME.MEDIA,
          schema: MediaSchema,
        }
      ]
    )
  ],
  controllers: [MediasController],
  providers: [MediasService]
})
export class MediasModule { }
