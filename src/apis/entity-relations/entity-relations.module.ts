import { Module } from '@nestjs/common';
import { EntityRelationsController } from './entity-relations.controller';
import { EntityRelationsService } from './entity-relations.service';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { EntityRelationSchema } from './entities/entity-relation.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: COLLECTION_NAME.ENTITY_RELATION,
        schema: EntityRelationSchema
      }
    ])
  ],
  controllers: [EntityRelationsController],
  providers: [EntityRelationsService],
  exports: [EntityRelationsService]
})
export class EntityRelationsModule { }
