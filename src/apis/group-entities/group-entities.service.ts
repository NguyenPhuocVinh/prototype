import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/cores/base-service/base.service';
import { GroupEntity } from './entities/group-entity.entity';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { BaseRepositoryService } from 'src/cores/base-service/repository.service';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class GroupEntitiesService extends BaseService<GroupEntity> {
    collection: string = COLLECTION_NAME.GROUP_ENTITY;
    baseRepositoryService: BaseRepositoryService<GroupEntity>;
    constructor(
        @InjectConnection()
        public readonly connection: Connection,
        @InjectModel(COLLECTION_NAME.GROUP_ENTITY)
        public readonly groupEntityModel: Model<GroupEntity>,
        eventEmitter: EventEmitter2
    ) {
        super(connection, groupEntityModel, eventEmitter, COLLECTION_NAME.GROUP_ENTITY);
        this.baseRepositoryService = new BaseRepositoryService<GroupEntity>(
            groupEntityModel,
            this.collection,
            eventEmitter
        );
    }
}
