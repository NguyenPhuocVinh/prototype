import { QUEUE_PROCESSOR_TITLE, QUEUE_TITLE } from '../../constants';
import { Processor, Process } from '@nestjs/bull';
import {
    IDeleteRelationQueueItem,
    IRelation,
} from '../update/update-relations.event';
import { Logger } from '@nestjs/common';
import { DeleteRelationsEvent } from './delete-relations.event';
import { convertToObjectIds } from 'src/common/func-helper/conver-value';

@Processor(QUEUE_PROCESSOR_TITLE.DELETE_RELATION_EMBEDDED)
export class DeleteRelationsProcessor {
    private readonly logger = new Logger(DeleteRelationsProcessor.name);
    constructor(private readonly deleteRelationsEvent: DeleteRelationsEvent) { }

    @Process(QUEUE_TITLE.DELETE_RELATION_EMBEDDED_ONE_TO_ONE)
    async handleDeleteRelationEmbeddedOneToOne(job: any) {
        const { data } = job;

        if (data && typeof data === 'object') {
            const deleteRelationItem: IDeleteRelationQueueItem = {
                ids: data.ids,
                collectionName: data.collectionName,
                slug: data.slug,
                relation: data.relation as IRelation,
                limit: data.limit,
                skip: data.skip,
            };

            this.logger.debug(
                `handleDeleteRelationEmbeddedOneToOne... ${deleteRelationItem.ids}. The limit is ${deleteRelationItem.limit} and the skip is ${deleteRelationItem.skip}`,
            );

            await this.deleteRelationsEvent.deleteEmbeddedOneToOne(
                deleteRelationItem,
            );
        }
    }

    @Process(QUEUE_TITLE.DELETE_RELATION_EMBEDDED_ONE_TO_MANY)
    async handleDeleteRelationEmbeddedOneToMany(job: any) {
        const { data } = job;

        if (data && typeof data === 'object') {
            const deleteRelationItem: IDeleteRelationQueueItem = {
                ids: data.ids,
                collectionName: data.collectionName,
                slug: data.slug,
                relation: data.relation as IRelation,
                limit: data.limit,
                skip: data.skip,
            };

            this.logger.debug(
                `handleDeleteRelationEmbeddedOneToMany... ${deleteRelationItem.ids}. The limit is ${deleteRelationItem.limit} and the skip is ${deleteRelationItem.skip}`,
            );

            await this.deleteRelationsEvent.deleteEmbeddedOneToMany(
                deleteRelationItem,
            );
        }
    }

}