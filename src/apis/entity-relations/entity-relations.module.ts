import { Module } from '@nestjs/common';
import { EntityRelationsController } from './entity-relations.controller';
import { EntityRelationsService } from './entity-relations.service';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { EntityRelationSchema } from './entities/entity-relation.entity';
import { UpdateRelationsEvent } from 'src/cores/event-handler/relations/update/update-relations.event';
import { UpdateRelationsProcessor } from 'src/cores/event-handler/relations/update/update-relations.processor';
import { QUEUE_PROCESSOR_TITLE } from 'src/cores/event-handler/constants';
import { DeleteRelationsEvent } from 'src/cores/event-handler/relations/delete/delete-relations.event';
import { DeleteRelationsProcessor } from 'src/cores/event-handler/relations/delete/delete-relations.processor';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: COLLECTION_NAME.ENTITY_RELATION,
        schema: EntityRelationSchema
      }
    ]),
    BullModule.registerQueue({
      name: QUEUE_PROCESSOR_TITLE.UPDATE_RELATION_EMBEDDED,
    }),
    BullModule.registerQueue({
      name: QUEUE_PROCESSOR_TITLE.DELETE_RELATION_EMBEDDED,
    }),
  ],
  controllers: [EntityRelationsController],
  providers: [
    EntityRelationsService,
    UpdateRelationsEvent,
    UpdateRelationsProcessor,
    DeleteRelationsEvent,
    DeleteRelationsProcessor
  ],
  exports: [EntityRelationsService]
})
export class EntityRelationsModule { }
