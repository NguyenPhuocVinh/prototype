import { Module } from '@nestjs/common';
import { GroupEntitiesController } from './group-entities.controller';
import { GroupEntitiesService } from './group-entities.service';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { GroupEntitySchema } from './entities/group-entity.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: COLLECTION_NAME.GROUP_ENTITY,
        schema: GroupEntitySchema
      }
    ])
  ],
  controllers: [GroupEntitiesController],
  providers: [GroupEntitiesService]
})
export class GroupEntitiesModule { }
