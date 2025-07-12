import { Module } from '@nestjs/common';
import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { EntitySchema } from './entities/model.entity';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: COLLECTION_NAME.ENTITY,
          schema: EntitySchema
        }
      ]
    )
  ],
  controllers: [ModelsController],
  providers: [ModelsService]
})
export class ModelsModule { }
