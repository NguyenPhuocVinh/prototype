import { Injectable, Logger } from "@nestjs/common";
import { IRelation, IResultEmbedded } from "../update/update-relations.event";
import { EntitiesService } from "src/cores/services/entities.service";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { EntityRelationsService } from "src/apis/entity-relations/entity-relations.service";
import { DELETE_RELATION_EVENT_TITLE, EMBEDDED_TYPE, QUEUE_PROCESSOR_TITLE, QUEUE_TITLE } from "../../constants";
import { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";
import { OnEvent } from "@nestjs/event-emitter";
import _ from "lodash";
import { convertToObjectIds } from "src/common/func-helper/conver-value";

export interface IDeleteRelationQueueItem {
    ids: string[];
    collectionName: string;
    slug: string;
    relation: IRelation;
    limit: number;
    skip: number;
}

export interface DeleteRelationsModel {
    ids: string[];
    collectionName: string;
}


@Injectable()
export class DeleteRelationsEvent extends EntitiesService {
    public readonly logger = new Logger(DeleteRelationsEvent.name);
    constructor(
        @InjectConnection() public readonly connection: Connection,
        public readonly entityRelationService: EntityRelationsService,
        @InjectQueue(QUEUE_PROCESSOR_TITLE.DELETE_RELATION_EMBEDDED)
        public deleteRelationQueue: Queue,
        // public readonly cacheMangerService: CacheMangerService,
    ) {
        super(connection);
    }

    async init(collectionName: string) {
        try {
            if (!collectionName) {
                return;
            }
            const entities = await this.entityRelationService.findAllEntity();
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
        } catch (e) {
            this.logger.error(e);
        }
    }

    @OnEvent(DELETE_RELATION_EVENT_TITLE.DELETE_RELATIONS_ALL)
    async handleDeleteEvent(event: DeleteRelationsModel) {
        try {
            const { collectionName } = event;
            if (!collectionName) {
                return;
            }

            const data = await this.init(collectionName);
            const { results } = data;

            for (const result of results) {
                console.log("🚀 ~ DeleteRelationsEvent ~ handleDeleteEvent ~ result:", result)

                const { relation } = result;
                const { embeddedType } = relation;
                if (embeddedType === EMBEDDED_TYPE.ONE_TO_MANY) {
                    await this.addQueueDeleteEmbeddedOneToMany(event, result);
                }

                if (embeddedType === EMBEDDED_TYPE.ONE_TO_ONE) {
                    await this.addQueueDeleteEmbeddedOneToOne(event, result);
                }

                if (embeddedType === EMBEDDED_TYPE.ONE_TO_MANY_PROPERTY) {
                    await this.addQueueDeleteEmbeddedOneToManyProperty(
                        event,
                        result,
                    );
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    async addQueueDeleteEmbeddedOneToMany(
        event: DeleteRelationsModel,
        resultEmbedded: IResultEmbedded,
    ) {
        try {
            const { ids, collectionName } = event;
            if (!collectionName) {
                return;
            }

            const { slug, relation } = resultEmbedded;
            const fieldUpdate = relation[collectionName];

            const finAllItemNeedUpdate = await this.getModel(
                slug,
            ).countDocuments({
                [fieldUpdate]: {
                    $elemMatch: { id: { $in: ids } },
                },
            });

            if (finAllItemNeedUpdate > 0) {
                const limit = 50;
                const skip = Math.ceil(finAllItemNeedUpdate / limit);
                this.logger.debug(
                    `Add queue delete relation addQueueDeleteEmbeddedOneToMany ${collectionName} _id: ${ids} in ${slug} collection _id: ${ids}. The total item need update: ${finAllItemNeedUpdate}. The limit: ${limit}. The skip: ${skip}`,
                );
                for (let i = 0; i < skip; i++) {
                    this.deleteRelationQueue.add(
                        QUEUE_TITLE.DELETE_RELATION_EMBEDDED_ONE_TO_MANY,
                        {
                            ids,
                            collectionName,
                            slug,
                            relation,
                            limit,
                            skip: i * limit,
                        } as IDeleteRelationQueueItem,
                        {
                            attempts: 3,
                            backoff: 1000,
                            delay: 1000,
                        },
                    );
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    async addQueueDeleteEmbeddedOneToManyProperty(
        event: DeleteRelationsModel,
        resultEmbedded: IResultEmbedded,
    ) {
        try {
            const { ids, collectionName } = event;
            if (!collectionName) {
                return;
            }

            const { slug, relation } = resultEmbedded;
            const fieldUpdate = relation[collectionName];

            const finAllItemNeedUpdate = await this.getModel(
                slug,
            ).countDocuments({
                [`${fieldUpdate}.id`]: {
                    $in: ids,
                },
            });

            if (finAllItemNeedUpdate > 0) {
                const limit = 50;
                const skip = Math.ceil(finAllItemNeedUpdate / limit);
                this.logger.debug(
                    `Add queue delete relation addQueueDeleteEmbeddedOneToManyProperty ${collectionName} _id: ${ids} in ${slug} collection _id: ${ids}. The total item need update: ${finAllItemNeedUpdate}. The limit: ${limit}. The skip: ${skip}`,
                );
                for (let i = 0; i < skip; i++) {
                    this.deleteRelationQueue.add(
                        QUEUE_TITLE.DELETE_RELATION_EMBEDDED_ONE_TO_MANY_PROPERTY,
                        {
                            ids,
                            collectionName,
                            slug,
                            relation,
                            limit,
                            skip: i * limit,
                        } as IDeleteRelationQueueItem,
                        {
                            attempts: 3,
                            backoff: 1000,
                            delay: 1000,
                        },
                    );
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    async addQueueDeleteEmbeddedOneToOne(
        event: DeleteRelationsModel,
        resultEmbedded: IResultEmbedded,
    ) {
        try {
            const { ids, collectionName } = event;
            if (!collectionName) {
                return;
            }

            const { slug, relation } = resultEmbedded;
            const fieldUpdate = relation[collectionName];

            const finAllItemNeedUpdate = await this.getModel(
                slug,
            ).countDocuments({
                [`${fieldUpdate}`]: {
                    $in: ids,
                },
            });

            if (finAllItemNeedUpdate > 0) {
                const limit = 50;
                const skip = Math.ceil(finAllItemNeedUpdate / limit);
                this.logger.debug(
                    `Add queue delete relation addQueueDeleteEmbeddedOneToOne ${collectionName} _id: ${ids} in ${slug} collection _id: ${ids}. The total item need update: ${finAllItemNeedUpdate}. The limit: ${limit}. The skip: ${skip}`,
                );
                for (let i = 0; i < skip; i++) {
                    this.deleteRelationQueue.add(
                        QUEUE_TITLE.DELETE_RELATION_EMBEDDED_ONE_TO_ONE,
                        {
                            ids,
                            collectionName,
                            slug,
                            relation,
                            limit,
                            skip: i * limit,
                        } as IDeleteRelationQueueItem,
                        {
                            attempts: 3,
                            backoff: 1000,
                            delay: 1000,
                        },
                    );
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    async deleteEmbeddedOneToOne(
        deleteRelationQueueItem: IDeleteRelationQueueItem,
    ) {
        try {
            const {
                ids,
                collectionName,
                slug,
                relation,
                limit,
                skip
            } = deleteRelationQueueItem;

            if (!collectionName) {
                return;
            }

            const fieldUpdate = relation[collectionName];
            const finAllItemNeedUpdate = await this.getModel(slug)
                .aggregate([
                    {
                        $match: {
                            [`${fieldUpdate}`]: {
                                $in: convertToObjectIds(ids),
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            [fieldUpdate]: 1,
                        },
                    },
                ])
                .limit(limit)
                .skip(skip);

            for (let itemNeedUpdate of finAllItemNeedUpdate) {
                const { _id } = itemNeedUpdate || {};

                this.logger.debug(
                    `Delete relation ${collectionName} _id: ${_id} in ${slug} collection _id: ${_id}`,
                );

                await this.getModel(slug).updateOne(
                    { _id },
                    {
                        $set: {
                            [fieldUpdate]: null,
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
            }

            // Clear cache
            // const cacheKeys: any = await this.cacheMangerService.getCache(
            //     `${appName}:${slug}`,
            // );
            // await this.cacheMangerService.clearAllCachedKeys(cacheKeys, slug);
        } catch (e) {
            console.log(e);
        }
    }

    async deleteEmbeddedOneToManyProperty(
        deleteRelationQueueItem: IDeleteRelationQueueItem,
    ) {
        try {
            const { ids, collectionName, slug, relation, limit, skip } =
                deleteRelationQueueItem;

            if (!collectionName) {
                return;
            }

            const fieldUpdate = relation[collectionName];
            const finAllItemNeedUpdate = await this.getModel(slug)
                .aggregate([
                    {
                        $match: {
                            [`${fieldUpdate}.id`]: {
                                $in: ids,
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
                for (const id of ids) {
                    for (let itemNeedUpdate of finAllItemNeedUpdate) {
                        const {
                            _id,
                            locale,
                            [fieldUpdates[0]]: fieldFist,
                        } = itemNeedUpdate || {};
                        const { [fieldUpdates[1]]: fieldSecond } = fieldFist;
                        const index = _.findIndex(fieldSecond, {
                            id,
                        });
                        fieldSecond.splice(index, 1);
                        this.logger.debug(
                            `Delete relation ${collectionName} _id: ${_id} in ${slug} collection _id: ${_id}`,
                        );
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
                        //         itemNeedUpdate?.id,
                        //         locale || null,
                        //     ),
                        // );
                    }
                }
            }

            // Clear cache
            // const cacheKeys: any = await this.cacheMangerService.getCache(
            //     `${appName}:${slug}`,
            // );
            // await this.cacheMangerService.clearAllCachedKeys(cacheKeys, slug);
        } catch (e) {
            console.log(e);
        }
    }

    async deleteEmbeddedOneToMany(
        deleteRelationQueueItem: IDeleteRelationQueueItem,
    ) {
        try {
            const { ids, collectionName, slug, relation, limit, skip } =
                deleteRelationQueueItem;

            if (!collectionName) {
                return;
            }

            const fieldUpdate = relation[collectionName];
            const finAllItemNeedUpdate = await this.getModel(slug)
                .aggregate([
                    {
                        $match: {
                            [fieldUpdate]: {
                                $elemMatch: { id: { $in: ids } },
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

            for (const id of ids) {
                for (let itemNeedUpdate of finAllItemNeedUpdate) {
                    const {
                        _id,
                        locale,
                        [fieldUpdate]: field,
                    } = itemNeedUpdate || {};

                    const index = _.findIndex(field, { id });
                    field.splice(index, 1);

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
                    //         itemNeedUpdate?.id,
                    //         locale || null,
                    //     ),
                    // );

                    this.logger.debug(
                        `Delete relation ${collectionName} _id: ${_id} in ${slug} collection _id: ${_id}`,
                    );
                }
            }

            // Clear cache
            // const cacheKeys: any = await this.cacheMangerService.getCache(
            //     `${appName}:${slug}`,
            // );
            // await this.cacheMangerService.clearAllCachedKeys(cacheKeys, slug);
        } catch (e) {
            console.log(e);
        }
    }
}
