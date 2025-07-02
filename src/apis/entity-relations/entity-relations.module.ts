import { Module } from '@nestjs/common';
import { EntityRelationsController } from './entity-relations.controller';
import { EntityRelationsService } from './entity-relations.service';

@Module({
  controllers: [EntityRelationsController],
  providers: [EntityRelationsService]
})
export class EntityRelationsModule {}
