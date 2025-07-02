import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectModel } from "@nestjs/mongoose";
import _ from "lodash";
import { ClientSession, Document, FilterQuery, Model, MongooseBaseQueryOptions, QueryOptions, SaveOptions, Types, UpdateQuery, UpdateWithAggregationPipeline } from "mongoose";
import { DELETE_RELATION_EVENT_TITLE, MULTIPLE_LANGUAGES_EVENT_TITLE, UPDATE_RELATION_EVENT_TITLE } from "src/cores/event-handler/constants";
import { COLLECTION_NAME } from "src/cores/__schema__/configs/enum";

export class BaseRepositoryService<T extends Document> {
    constructor(
        @InjectModel('') private model: Model<T>,
        private readonly collectionName: string,
        public readonly eventEmitter: EventEmitter2,
    ) { }

    async save(data: T, options?: SaveOptions): Promise<T> {
        await data.save(options);
        return data;
    }

    async updateOne(
        filter: FilterQuery<T>,
        update: UpdateQuery<T>,
        session?: ClientSession
    ): Promise<T | null> {
        await this.model.updateOne(
            filter,
            update,
            { session }
        );

        const collection = await this.model.findOne(filter).session(session);
        await this.handleUpdateEvents(collection);
        return collection;
    }

    async findOneAndUpdate(
        filter?: FilterQuery<T>,
        update?: UpdateQuery<T>,
        options?: QueryOptions<T> | null,
    ): Promise<T | null> {
        const collection = await this.model.findOneAndUpdate(
            filter,
            update,
            options
        )
        await this.handleUpdateEvents(collection);
        return collection;
    }

    async findByIdAndUpdate(
        id?: Types.ObjectId | string,
        update?: UpdateQuery<T>,
        options?: QueryOptions<T> | null,
    ): Promise<T | null> {
        const collection = await this.model.findByIdAndUpdate(
            id,
            update,
            options
        );
        await this.handleUpdateEvents(collection);
        return collection;
    }

    async updateMany(
        filter: FilterQuery<T>,
        update: UpdateQuery<T> | UpdateWithAggregationPipeline,
        options?: any,
    ) {
        const collections = await this.model.find(filter).select('id');
        await this.model.updateMany(
            filter,
            update,
            options
        )

        const ids = _.uniq(collections.map((collection) => collection.id));

        if (_.size(ids) === 0) {
            return;
        }

        for (const collection of collections) {
            const { _id } = collection;
            if (this.collectionName === COLLECTION_NAME.FILE) {
                this.eventEmitter.emit(
                    UPDATE_RELATION_EVENT_TITLE.UPDATE_RELATION_MEDIA,
                    {
                        _id,
                        collectionName: this.collectionName,
                    }
                )
                return collection;
            }

            if (this.collectionName === COLLECTION_NAME.USER) {
                this.eventEmitter.emit(
                    UPDATE_RELATION_EVENT_TITLE.UPDATE_RELATION_USER,
                    {
                        _id,
                        collectionName: COLLECTION_NAME.USER,
                    },
                );
                return collection;
            }

            this.eventEmitter.emit(
                UPDATE_RELATION_EVENT_TITLE.UPDATE_RELATIONS_ALL,
                {
                    _id,
                    collectionName: this.collectionName,
                },
            );

        }
        return collections;
    }

    async deleteMany(
        filter?: FilterQuery<T>,
        options?: MongooseBaseQueryOptions<T> | null,
    ): Promise<T[]> {
        const collections = await this.model.find(filter).select('id');
        const result = await this.model.deleteMany(filter, options);
        const ids = _.uniq(collections.map((collection) => collection.id));

        if (_.size(ids) === 0) {
            return;
        }

        if (this.collectionName === COLLECTION_NAME.FILE) {
            this.eventEmitter.emit(
                DELETE_RELATION_EVENT_TITLE.DELETE_RELATION_MEDIA,
                {
                    ids,
                    collectionName: COLLECTION_NAME.FILE,
                },
            );
            return collections;
        }

        this.eventEmitter.emit(
            DELETE_RELATION_EVENT_TITLE.DELETE_RELATIONS_ALL,
            {
                ids,
                collectionName: this.collectionName,
            },
        );

        return collections;
    }

    private async handleUpdateEvents(
        collection: T
    ): Promise<T | void> {
        if (!collection) {
            return;
        }
        if (this.collectionName === COLLECTION_NAME.FILE) {
            this.eventEmitter.emit(
                UPDATE_RELATION_EVENT_TITLE.UPDATE_RELATION_MEDIA,
                {
                    _id: collection._id,
                    collectionName: this.collectionName,
                }
            )
            return collection;
        }

        if (this.collectionName === COLLECTION_NAME.USER) {
            this.eventEmitter.emit(
                UPDATE_RELATION_EVENT_TITLE.UPDATE_RELATION_USER,
                {
                    _id: collection._id,
                    collectionName: this.collectionName,
                }
            )
        }

        this.eventEmitter.emit(
            UPDATE_RELATION_EVENT_TITLE.UPDATE_RELATIONS_ALL,
            {
                _id: collection._id,
                collectionName: this.collectionName,
            }
        );

        // const locale = _.get(collection, 'locale', null);
        // if (locale) {
        //     this.eventEmitter.emit(
        //         MULTIPLE_LANGUAGES_EVENT_TITLE.UPDATE_DOCUMENT,
        //         {
        //             id: collection?.id,
        //             locale,
        //             collectionName: this.collectionName,
        //         },
        //     );
        // }

        return collection;
    }
} 