import { EMBEDDED_TYPE, QUEUE_PROCESSOR_TITLE, QUEUE_TITLE, UPDATE_RELATION_EVENT_TITLE } from "../../constants";
import { Injectable, Logger } from "@nestjs/common";
import { EntitiesService } from "src/cores/services/entities.service";
import { InjectConnection } from "@nestjs/mongoose";
import { OnEvent } from "@nestjs/event-emitter";
import { EntityRelationsService } from "src/apis/entity-relations/entity-relations.service";
import _ from "lodash";
import { relationRootPick } from "src/common/models/root/relation-root";
import { Connection, Types } from "mongoose";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
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
export interface UpdateRelationsModel {
    _id: Types.ObjectId;
    collectionName: string;
}

export interface IResultEmbedded {
    slug: string;
    relation: IRelation;
}

@Injectable()
export class UpdateRelationsEvent extends EntitiesService {
    public readonly logger = new Logger(UpdateRelationsEvent.name);
    constructor(
        @InjectConnection() public readonly connection: Connection,
        private readonly entityRelationsService: EntityRelationsService,
        @InjectQueue(QUEUE_PROCESSOR_TITLE.UPDATE_RELATION_EMBEDDED)
        public updateRelationQueue: Queue,
        // public readonly cacheMangerService: CacheMangerService,
    ) {
        super(connection);
    }

    async init(collectionName: string) {
        try {
            if (!collectionName) {
                throw new Error('Collection name is required');
            }

            const entities = await this.entityRelationsService.findAllEntity();
            const results = [];
            for (const entity of entities) {
                const { slug, relations } = entity;
                for (const relation of relations) {
                    if (relation[collectionName]) {
                        results.push({
                            slug,
                            relation,
                        });
                    }
                }
            }

            return {
                results: results as IResultEmbedded[],
            };
        } catch (error) {
            this.logger.error(error);
        }
    }

    @OnEvent(UPDATE_RELATION_EVENT_TITLE.UPDATE_RELATIONS_ALL)
    async handleUpdateEvent(event: UpdateRelationsModel) {
        try {
            const { collectionName } = event;
            if (!collectionName) {
                throw new Error('Collection name is required');
            }

            const data = await this.init(collectionName);
            const { results } = data;

            for (const result of results) {
                const { relation } = result;
                const { embeddedType } = relation;
                if (embeddedType === EMBEDDED_TYPE.ONE_TO_MANY) {
                    await this.addQueueUpdateEmbeddedOneToMany(event, result);
                }

                if (embeddedType === EMBEDDED_TYPE.ONE_TO_ONE) {
                    await this.addQueueUpdateEmbeddedOneToOne(event, result);
                }

                if (embeddedType === EMBEDDED_TYPE.ONE_TO_MANY_PROPERTY) {
                    await this.addQueueUpdateEmbeddedOneToManyProperty(
                        event,
                        result,
                    );
                }
            }
        } catch (error) {
            this.logger.error(error);
        }
    }

    async addQueueUpdateEmbeddedOneToMany(
        event: UpdateRelationsModel,
        resultEmbedded: IResultEmbedded,
    ) {
        try {
            const { _id, collectionName } = event;
            if (!collectionName) {
                return;
            }

            const item = await this.getModel(collectionName).findOne({ _id });

            if (!item) {
                return;
            }

            const { slug, relation } = resultEmbedded;

            const fieldUpdate = relation[collectionName];

            const countItemNeedUpdate = await this.getModel(
                slug,
            ).countDocuments({
                [fieldUpdate]: {
                    $elemMatch: {
                        _id: {
                            $in: [item._id, item._id.toString()],
                        },
                    },
                },
            });

            if (countItemNeedUpdate > 0) {
                const limit = 50;
                const skip = Math.ceil(countItemNeedUpdate / limit);
                this.logger.debug(
                    `Add queue update relation ${collectionName} _id: ${_id} in ${slug} collection _id: ${_id}. The total item need update: ${countItemNeedUpdate}. The limit: ${limit}. The skip: ${skip}`,
                );
                for (let i = 0; i < skip; i++) {
                    await this.updateRelationQueue.add(
                        QUEUE_TITLE.UPDATE_RELATION_REFERENCE_ONE_TO_MANY,
                        {
                            _id,
                            collectionName,
                            slug,
                            relation,
                            limit,
                            skip: i * limit,
                        } as IUpdateRelationQueueItem,
                        {
                            attempts: 3,
                            backoff: 1000,
                            delay: 1000,
                        },
                    );
                }
            }
        } catch (error) {
            this.logger.error(error);
        }
    }

    async addQueueUpdateEmbeddedOneToOne(
        event: UpdateRelationsModel,
        resultEmbedded: IResultEmbedded,
    ) {
        try {
            const { _id, collectionName } = event;
            if (!collectionName) {
                return;
            }

            const item = await this.getModel(collectionName).findOne({ _id });

            const { slug, relation } = resultEmbedded;

            const fieldUpdate = relation[collectionName];

            const countItemNeedUpdate = await this.getModel(
                slug,
            ).countDocuments({
                $or: [
                    { [`${fieldUpdate}`]: item._id },
                    { [`${fieldUpdate}`]: item._id.toString() },
                ],
            });

            if (countItemNeedUpdate > 0) {
                const limit = 50;
                const skip = Math.ceil(countItemNeedUpdate / limit);
                this.logger.debug(
                    `Add queue update relation ${collectionName} _id: ${_id} in ${slug} collection _id: ${_id}. The total item need update: ${countItemNeedUpdate}. The limit: ${limit}. The skip: ${skip}`,
                );
                for (let i = 0; i < skip; i++) {
                    await this.updateRelationQueue.add(
                        QUEUE_TITLE.UPDATE_RELATION_REFERENCE_ONE_TO_ONE,
                        {
                            _id,
                            collectionName,
                            slug,
                            relation,
                            limit,
                            skip: i * limit,
                        } as IUpdateRelationQueueItem,
                        {
                            attempts: 3,
                            backoff: 1000,
                            delay: 1000,
                        },
                    );
                }
            }
        } catch (error) {
            this.logger.error(error);
        }
    }

    async addQueueUpdateEmbeddedOneToManyProperty(
        event: UpdateRelationsModel,
        resultEmbedded: IResultEmbedded,
    ) {
        try {
            const { _id, collectionName } = event;
            if (!collectionName) {
                return;
            }

            const item = await this.getModel(collectionName).findOne({ _id });

            const { slug, relation } = resultEmbedded;

            const fieldUpdate = relation[collectionName];

            const countItemNeedUpdate = await this.getModel(
                slug,
            ).countDocuments({
                [fieldUpdate]: {
                    $elemMatch: {
                        _id: {
                            $in: [item._id, item._id.toString()],
                        },
                    },
                },
            });

            if (countItemNeedUpdate > 0) {
                const limit = 50;
                const skip = Math.ceil(countItemNeedUpdate / limit);
                this.logger.debug(
                    `Add queue update relation ${collectionName} _id: ${_id} in ${slug} collection _id: ${_id}. The total item need update: ${countItemNeedUpdate}. The limit: ${limit}. The skip: ${skip}`,
                );
                for (let i = 0; i < skip; i++) {
                    await this.updateRelationQueue.add(
                        QUEUE_TITLE.UPDATE_RELATION_REFERENCE_ONE_TO_MANY_PROPERTY,
                        {
                            _id,
                            collectionName,
                            slug,
                            relation,
                            limit,
                            skip: i * limit,
                        } as IUpdateRelationQueueItem,
                        {
                            attempts: 3,
                            backoff: 1000,
                            delay: 1000,
                        },
                    );
                }
            }
        } catch (error) {
            this.logger.error(error);
        }
    }

    async updateEmbeddedOneToManyProperty(
        updateRelationQueueItem: IUpdateRelationQueueItem,
    ) {
        try {
            const { _id, collectionName, slug, relation, limit, skip } =
                updateRelationQueueItem;
            if (!collectionName) {
                return;
            }

            const item = await this.getModel(collectionName).findOne({ _id });

            const fieldUpdate = relation[collectionName];

            const finAllItemNeedUpdate = await this.getModel(slug)
                .aggregate([
                    {
                        $match: {
                            [fieldUpdate]: {
                                $elemMatch: {
                                    _id: {
                                        $in: [item._id, item._id.toString()],
                                    },
                                },
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            id: 1,
                            locale: 1,
                            [fieldUpdate]: 1,
                        },
                    },
                ])
                .skip(skip)
                .limit(limit);

            const fieldUpdates = fieldUpdate.split('.');
            if (fieldUpdates.length > 1) {
                for (let itemNeedUpdate of finAllItemNeedUpdate) {
                    const {
                        _id,
                        id,
                        locale,
                        [fieldUpdates[0]]: fieldFist,
                    } = itemNeedUpdate || {};

                    const { [fieldUpdates[1]]: fieldSecond } = fieldFist;

                    const index = _.findIndex(fieldSecond, function (o) {
                        return o['_id'].toString() === item._id.toString();
                    });

                    fieldSecond[index] = _.pick(item, relationRootPick);

                    await this.getModel(slug).updateOne(
                        { _id },
                        {
                            $set: {
                                [fieldUpdate]: fieldSecond,
                                updated_at: new Date(),
                            },
                        },
                    );

                    // Clear cache
                    // await this.cacheMangerService.clearCachedKey(
                    //     await this.cacheMangerService.generateCacheKeyForFindOne(
                    //         slug,
                    //         id,
                    //         locale || null,
                    //     ),
                    // );

                    this.logger.debug(
                        `Update relation ${collectionName} _id: ${updateRelationQueueItem?._id} in ${slug} collection _id: ${_id}`,
                    );
                }
            }

            // Clear cache
            // const cacheKeys: any = await this.cacheMangerService.getCache(
            //     `${appName}:${slug}`,
            // );
            // await this.cacheMangerService.clearAllCachedKeys(cacheKeys, slug);
        } catch (error) {
            this.logger.error(error);
        }
    }

    async updateEmbeddedOneToOne(
        updateRelationQueueItem: IUpdateRelationQueueItem,
    ) {
        try {
            const { _id, collectionName, slug, relation, limit, skip } =
                updateRelationQueueItem;
            if (!collectionName) {
                return;
            }

            const item = await this.getModel(collectionName).findOne({ _id });

            const fieldUpdate = relation[collectionName];

            const finAllItemNeedUpdate = await this.getModel(slug)
                .aggregate([
                    {
                        $match: {
                            $or: [
                                { [`${fieldUpdate}`]: item._id },
                                { [`${fieldUpdate}`]: item._id.toString() },
                            ],
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            id: 1,
                            locale: 1,
                            [fieldUpdate]: 1,
                        },
                    },
                ])
                .limit(limit)
                .skip(skip);

            for (let itemNeedUpdate of finAllItemNeedUpdate) {
                const { _id, id, locale } = itemNeedUpdate || {};

                const newField = _.pick(item, relationRootPick);

                await this.getModel(slug).updateOne(
                    { _id },
                    {
                        $set: {
                            [fieldUpdate]: newField,
                            updated_at: new Date(),
                        },
                    },
                );

                // Clear cache
                // await this.cacheMangerService.clearCachedKey(
                //     await this.cacheMangerService.generateCacheKeyForFindOne(
                //         slug,
                //         id,
                //         locale || null,
                //     ),
                // );

                this.logger.debug(
                    `Update relation ${collectionName} _id: ${updateRelationQueueItem?._id} in ${slug} collection _id: ${_id}`,
                );
            }

            // Clear cache
            // const cacheKeys: any = await this.cacheMangerService.getCache(
            //     `${appName}:${slug}`,
            // );
            // await this.cacheMangerService.clearAllCachedKeys(cacheKeys, slug);
        } catch (error) {
            this.logger.error(error);
        }
    }

    async updateEmbeddedOneToMany(
        updateRelationQueueItem: IUpdateRelationQueueItem,
    ) {
        try {
            const { _id, collectionName, slug, relation, limit, skip } =
                updateRelationQueueItem;
            if (!collectionName) {
                return;
            }

            const item = await this.getModel(collectionName).findOne({ _id });

            const fieldUpdate = relation[collectionName];

            const finAllItemNeedUpdate = await this.getModel(slug)
                .aggregate([
                    {
                        $match: {
                            [fieldUpdate]: {
                                $elemMatch: {
                                    _id: {
                                        $in: [item._id, item._id.toString()],
                                    },
                                },
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            id: 1,
                            locale: 1,
                            [fieldUpdate]: 1,
                        },
                    },
                ])
                .skip(skip)
                .limit(limit);

            for (let itemNeedUpdate of finAllItemNeedUpdate) {
                const {
                    _id,
                    id,
                    locale,
                    [fieldUpdate]: field,
                } = itemNeedUpdate || {};

                const index = _.findIndex(field, function (o) {
                    return o['_id'].toString() === item._id.toString();
                });

                field[index] = _.pick(item, relationRootPick);

                await this.getModel(slug).updateOne(
                    { _id },
                    {
                        $set: {
                            [fieldUpdate]: field,
                            updated_at: new Date(),
                        },
                    },
                );

                // Clear cache
                // await this.cacheMangerService.clearCachedKey(
                //     await this.cacheMangerService.generateCacheKeyForFindOne(
                //         slug,
                //         id,
                //         locale || null,
                //     ),
                // );

                this.logger.debug(
                    `Update relation ${collectionName} _id: ${updateRelationQueueItem?._id} in ${slug} collection _id: ${_id}`,
                );
            }

            // Clear cache
            // const cacheKeys: any = await this.cacheMangerService.getCache(
            //     `${appName}:${slug}`,
            // );
            // await this.cacheMangerService.clearAllCachedKeys(cacheKeys, slug);
        } catch (error) {
            this.logger.error(error);
        }
    }
}