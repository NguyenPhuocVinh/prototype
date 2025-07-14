import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from 'src/cores/base-service/base.service';
import { EntityRelation } from './entities/entity-relation.entity';
import { BaseRepositoryService } from 'src/cores/base-service/repository.service';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EntityRelationsService extends BaseService<EntityRelation> {
    baseRepositoryService: BaseRepositoryService<EntityRelation>;
    collection: string = COLLECTION_NAME.ENTITY_RELATION;
    private readonly logger = new Logger(EntityRelationsService.name);
    constructor(
        @InjectConnection() public readonly connection: Connection,
        @InjectModel(COLLECTION_NAME.ENTITY_RELATION)
        private readonly entityRelationModel: Model<EntityRelation>,
        eventEmitter: EventEmitter2,

    ) {
        super(
            connection,
            entityRelationModel,
            eventEmitter,
            COLLECTION_NAME.ENTITY_RELATION,
        );
        this.baseRepositoryService = new BaseRepositoryService(
            entityRelationModel,
            this.collection,
            eventEmitter,
        );
    }

    async updateRelationsForCollection(
        collectionName: string,
        relations: Array<Object>,
    ) {
        const entity = await this.entityRelationModel.findOne({
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
            await this.entityRelationModel.create({
                key: collectionName,
                name: collectionName,
                slug: collectionName,
                relations,
            });

            this.logger.debug(`Create relations for ${collectionName} done`);
        }
    }


    async findAllEntity() {
        return await this.entityRelationModel
            .find({
                relations: {
                    $exists: true,
                    $ne: [],
                },
            })
            .exec();
    }
}
