import { Module } from '@nestjs/common';
import { EntityRelationsController } from './entity-relations.controller';
import { EntityRelationsService } from './entity-relations.service';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { EntitiesSchema } from './entities/entity-relation.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: COLLECTION_NAME.ENTITIES,
        schema: EntitiesSchema
      }
    ])
  ],
  controllers: [EntityRelationsController],
  providers: [EntityRelationsService],
  exports: [EntityRelationsService]
})
export class EntityRelationsModule { }
