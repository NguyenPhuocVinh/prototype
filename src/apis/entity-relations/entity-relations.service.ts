import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from 'src/cores/base-service/base.service';
import { Entities } from './entities/entity-relation.entity';
import { BaseRepositoryService } from 'src/cores/base-service/repository.service';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EntityRelationsService extends BaseService<Entities> {
    baseRepositoryService: BaseRepositoryService<Entities>;
    collection: string = COLLECTION_NAME.ENTITIES;
    private readonly logger = new Logger(EntityRelationsService.name);
    constructor(
        @InjectConnection() public readonly connection: Connection,
        @InjectModel(COLLECTION_NAME.ENTITIES)
        private readonly entitiesModel: Model<Entities>,
        eventEmitter: EventEmitter2,

    ) {
        super(
            connection,
            entitiesModel,
            eventEmitter,
            COLLECTION_NAME.ENTITIES,
        );
        this.baseRepositoryService = new BaseRepositoryService(
            entitiesModel,
            this.collection,
            eventEmitter,
        );
    }

    async updateRelationsForCollection(
        collectionName: string,
        relations: Array<Object>,
    ) {
        const entity = await this.entitiesModel.findOne({
            key: collectionName,
        });

        if (entity) {
            await this.baseRepositoryService.updateOne(
                { key: collectionName },
                {
                    $set: {
                        relations,
                    },
                },
            );

            this.logger.debug(`Update relations for ${collectionName} done`);
        }

        if (!entity) {
            await this.entitiesModel.create({
                key: collectionName,
                name: collectionName,
                slug: collectionName,
                relations,
            });

            this.logger.debug(`Create relations for ${collectionName} done`);
        }
    }
}
