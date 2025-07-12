import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from 'src/cores/base-service/base.service';
import { Entity } from './entities/model.entity';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { BaseRepositoryService } from 'src/cores/base-service/repository.service';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ModelsService extends BaseService<Entity> {
    baseRepositoryService: BaseRepositoryService<Entity>;
    collection: string = COLLECTION_NAME.ENTITY;
    private readonly logger = new Logger(ModelsService.name);

    constructor(
        @InjectConnection()
        public readonly connection: Connection,
        @InjectModel(COLLECTION_NAME.ENTITY)
        private readonly modelModel: Model<Entity>,
        eventEmitter: EventEmitter2
    ) {
        super(connection, modelModel, eventEmitter, COLLECTION_NAME.ENTITY);
        this.baseRepositoryService = new BaseRepositoryService(
            modelModel,
            this.collection,
            eventEmitter
        )
    }
}
