import { Connection, Types } from "mongoose";
import { EMBEDDED_TYPE, QUEUE_PROCESSOR_TITLE, UPDATE_RELATION_EVENT_TITLE } from "../../constants";
import { Injectable, Logger } from "@nestjs/common";
import { EntitiesService } from "src/cores/services/entities.service";
import { InjectConnection } from "@nestjs/mongoose";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { OnEvent } from "@nestjs/event-emitter";
export interface IRelation {
    [key: string]: string;
    embeddedType: EMBEDDED_TYPE;
}

export interface IUpdateRelationQueueItem {
    _id: Types.ObjectId;
    collectionName: string;
    slug: string;
    relation: IRelation;
    limit: number;
    skip: number;
}

export interface IDeleteRelationQueueItem {
    ids: string[];
    collectionName: string;
    slug: string;
    relation: IRelation;
    limit: number;
    skip: number;
}

export interface IDeleteRelationQueueItem {
    ids: string[];
    collectionName: string;
    slug: string;
    relation: IRelation;
    limit: number;
    skip: number;
}

export interface UpdateRelationsModel {
    _id: Types.ObjectId;
    collectionName: string;
}


@Injectable()
export class UpdateRelationsEvent extends EntitiesService {
    public readonly logger = new Logger(UpdateRelationsEvent.name);
    constructor(
        @InjectConnection() public readonly connection: Connection,
        @InjectQueue(QUEUE_PROCESSOR_TITLE.UPDATE_RELATION_EMBEDDED)
        public updateRelationQueue: Queue,
        // public readonly cacheMangerService: CacheMangerService,
    ) {
        super(connection);
    }

    // @OnEvent(UPDATE_RELATION_EVENT_TITLE.UPDATE_RELATIONS_ALL)
    // async handleUpdateEvent(event: UpdateRelationsModel) {
    //     try {
    //         const { collectionName } = event;
    //         if (!collectionName) {
    //             throw new Error('Collection name is required');
    //         }

    //         const data = await this.init(collectionName);
    //         const { results } = data;

    //         for (const result of results) {
    //             const { relation } = result;
    //             const { embeddedType } = relation;
    //             if (embeddedType === EMBEDDED_TYPE.ONE_TO_MANY) {
    //                 await this.addQueueUpdateEmbeddedOneToMany(event, result);
    //             }

    //             if (embeddedType === EMBEDDED_TYPE.ONE_TO_ONE) {
    //                 await this.addQueueUpdateEmbeddedOneToOne(event, result);
    //             }

    //             if (embeddedType === EMBEDDED_TYPE.ONE_TO_MANY_PROPERTY) {
    //                 await this.addQueueUpdateEmbeddedOneToManyProperty(
    //                     event,
    //                     result,
    //                 );
    //             }
    //         }
    //     } catch (error) {
    //         this.logger.error(error);
    //     }
    // }

}