import { ConflictException, Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { BaseService } from 'src/cores/base-service/base.service';
import { Entity } from './entities/model.entity';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { BaseRepositoryService } from 'src/cores/base-service/repository.service';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model, Schema, Types } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreatedBy } from 'src/common/models/root/created-by-root';
import { CreateEntityDto } from './dto/create-entity.dto';
import { removeDiacritics } from 'src/common/func-helper/conver-value';
import _ from 'lodash';
import { mongooseTransactionHandler } from 'src/common/func-helper/mongoose-transaction';
import { jsonSchemaToMongooseSchema } from 'src/common/func-helper/json-schema-to-mongoose-schema';
import { getEmbeddedType, relationsJsonSchema } from 'src/cores/__schema__/configs';
import { EntityRelationsService } from '../entity-relations/entity-relations.service';
import { PagingDto } from 'src/common/dto/page-result.dto';

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
        private readonly entityRelationService: EntityRelationsService,
        eventEmitter: EventEmitter2
    ) {
        super(connection, modelModel, eventEmitter, COLLECTION_NAME.ENTITY);
        this.baseRepositoryService = new BaseRepositoryService(
            modelModel,
            this.collection,
            eventEmitter
        )
    }

    async create(
        payload: CreateEntityDto,
        user?: CreatedBy,
        id?: string
    ): Promise<{ data: Entity }> {
        const { jsonSchema } = payload;

        const session = await this.connection.startSession();

        let slug = _.get(payload, 'slug', null);
        if (!slug) {
            const name = _.get(payload, 'name', null);
            slug = _.kebabCase(removeDiacritics(name));
        }

        const baseSchema = jsonSchemaToMongooseSchema(jsonSchema).obj;

        const schemaDefWithRef = {
            ...baseSchema,
            _entity: {
                type: Types.ObjectId,
                ref: COLLECTION_NAME.ENTITY,
                required: true,
            },
        };

        const collectionName = slug;

        const mongooseSchema = new Schema(schemaDefWithRef, {
            timestamps: true,
            collection: slug,
        });


        let DynamicModel: Model<any>;
        try {
            DynamicModel = this.connection.model(collectionName);
        } catch {
            DynamicModel = this.connection.model(
                collectionName,
                mongooseSchema,
                collectionName
            );
        }

        const result = new this.modelModel({
            ...payload,
            _id: id,
            tenant: new Types.ObjectId(user?.tenant),
            createdBy: user,
            slug,
        });

        const transactionHandlerMethod = async () => {
            const collections = await this.connection.db.listCollections({ name: slug }).toArray();
            if (collections.length === 0) {
                await this.connection.db.createCollection(slug);
            }

            await this.baseRepositoryService.save(result, { session });
        };

        await mongooseTransactionHandler<void>(
            transactionHandlerMethod,
            (error) => {
                throw new UnprocessableEntityException(error);
            },
            this.connection,
            session,
        );

        const relations = relationsJsonSchema(jsonSchema);
        relations.push({
            [COLLECTION_NAME.ENTITY]: '_entity',
            embeddedType: getEmbeddedType('_entity', Types.ObjectId.name),
        });

        await this.entityRelationService.updateRelationsForCollection(
            slug,
            relations,
        )

        return { data: result };
    }

    async getModel(slug: string): Promise<Model<any>> {
        if (this.connection.models[slug]) {
            return this.connection.models[slug];
        }

        const entity = await this.modelModel.findOne({ slug });
        if (!entity?.jsonSchema) {
            this.logger.warn(
                `Entity ${slug} not found or missing jsonSchema
                `);
            throw new NotFoundException(
                `Entity ${slug} not found or missing jsonSchema`
            );
        }

        const schemaDef = jsonSchemaToMongooseSchema(entity.jsonSchema).obj;

        const schema = new Schema(
            {
                ...schemaDef,
                _entity: {
                    type: Types.ObjectId,
                    ref: COLLECTION_NAME.ENTITY
                },
            },
            {
                timestamps: true,
                collection: slug
            }
        );

        return this.connection.model(slug, schema, slug);
    }


    async getDynamicModels(): Promise<Model<Entity>[]> {
        const entities = await this.modelModel.find({}, { slug: 1 });

        const dynamicModels: Model<Entity>[] = [];

        for (const entity of entities) {
            const slug = entity.slug;
            try {
                const model = await this.getModel(slug);
                dynamicModels.push(model);
            } catch (err) {
                this.logger.warn(
                    `Skipping model ${slug}: ${err.message}`
                );
            }
        }

        return dynamicModels;
    }

    async findById(id: string): Promise<{ data: any | null; }> {
        const entity = await this.modelModel.findById(id).populate('groupEntity');
        if (!entity) {
            throw new NotFoundException(`Entity with ID ${id} not found`);
        }
        return { data: entity };
    }

    // TODO
    // async checkValidData(payload: any, model: Model<any>) {
    //     const slug = _.get(model, 'collection.name');
    //     if (!slug) throw new NotFoundException('Model collection name not found');

    //     const entity = await this.modelModel.findOne({ slug }, { jsonSchema: 1 });
    //     if (!entity?.jsonSchema) {
    //         throw new NotFoundException(`Entity with slug ${slug} not found`);
    //     }

    //     const doc = new model(payload);
    //     const validationError = doc.validateSync({ strict: true });
    //     if (validationError) {
    //         throw new UnprocessableEntityException(validationError);
    //     }

    //     const uniqueFields = _(entity.jsonSchema.properties)
    //         .pickBy((prop: any) => prop?.unique)
    //         .keys()
    //         .value();

    //     const conflicts: string[] = [];

    //     for (const field of uniqueFields) {
    //         const value = _.get(payload, field);
    //         if (_.isNil(value)) continue;

    //         const exists = await model.exists({ [field]: value });
    //         if (exists) {
    //             conflicts.push(field);
    //         }
    //     }

    //     if (conflicts.length > 0) {
    //         throw new ConflictException(`Data conflict at field(s): ${conflicts.join(', ')}`);
    //     }

    //     return true;
    // }
}