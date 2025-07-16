import { Types } from 'mongoose';
import { QUEUE_PROCESSOR_TITLE, QUEUE_TITLE } from '../../constants';
import {
    IRelation,
    IUpdateRelationQueueItem,
    UpdateRelationsEvent,
} from './update-relations.event';
import { Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';

@Processor(QUEUE_PROCESSOR_TITLE.UPDATE_RELATION_EMBEDDED)
export class UpdateRelationsProcessor {
    private readonly logger = new Logger(UpdateRelationsProcessor.name);
    constructor(private readonly updateRelationsEvent: UpdateRelationsEvent) { }

    @Process(QUEUE_TITLE.UPDATE_RELATION_REFERENCE_ONE_TO_ONE)
    async handleUpdateRelationEmbeddedOneToOne(job: any) {
        const { data } = job;

        if (data && typeof data === 'object') {
            const updateRelationItem: IUpdateRelationQueueItem = {
                _id: data._id as Types.ObjectId,
                collectionName: data.collectionName,
                slug: data.slug,
                relation: data.relation as IRelation,
                limit: data.limit,
                skip: data.skip,
            };

            this.logger.debug(
                `handleUpdateRelationEmbeddedOneToOne... ${updateRelationItem._id}. The limit is ${updateRelationItem.limit} and the skip is ${updateRelationItem.skip}`,
            );

            await this.updateRelationsEvent.updateEmbeddedOneToOne({
                ...updateRelationItem,
                _id: new Types.ObjectId(updateRelationItem._id),
            });
        }
    }

    @Process(QUEUE_TITLE.UPDATE_RELATION_REFERENCE_ONE_TO_MANY)
    async handleUpdateRelationEmbeddedOneToMany(job: any) {
        const { data } = job;

        if (data && typeof data === 'object') {
            const updateRelationItem: IUpdateRelationQueueItem = {
                _id: data._id as Types.ObjectId,
                collectionName: data.collectionName,
                slug: data.slug,
                relation: data.relation as IRelation,
                limit: data.limit,
                skip: data.skip,
            };

            this.logger.debug(
                `handleUpdateRelationEmbeddedOneToMany... ${updateRelationItem._id}. The limit is ${updateRelationItem.limit} and the skip is ${updateRelationItem.skip}`,
            );

            await this.updateRelationsEvent.updateEmbeddedOneToMany({
                ...updateRelationItem,
                _id: new Types.ObjectId(updateRelationItem._id),
            });
        }
    }

    @Process(QUEUE_TITLE.UPDATE_RELATION_REFERENCE_ONE_TO_MANY_PROPERTY)
    async handleUpdateRelationEmbeddedOneToManyProperty(job: any) {
        const { data } = job;

        if (data && typeof data === 'object') {
            const updateRelationItem: IUpdateRelationQueueItem = {
                _id: data._id as Types.ObjectId,
                collectionName: data.collectionName,
                slug: data.slug,
                relation: data.relation as IRelation,
                limit: data.limit,
                skip: data.skip,
            };

            this.logger.debug(
                `handleUpdateRelationEmbeddedOneToManyProperty... ${updateRelationItem._id}. The limit is ${updateRelationItem.limit} and the skip is ${updateRelationItem.skip}`,
            );

            await this.updateRelationsEvent.updateEmbeddedOneToManyProperty({
                ...updateRelationItem,
                _id: new Types.ObjectId(updateRelationItem._id),
            });
        }
    }
}