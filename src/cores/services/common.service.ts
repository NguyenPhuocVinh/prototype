import { Injectable, Logger, UnprocessableEntityException } from "@nestjs/common";
import { EntitiesService } from "./entities.service";
import { Connection } from "mongoose";
import { InjectConnection } from "@nestjs/mongoose";
import { COLLECTION_NAME } from "../__schema__/configs/enum";

export interface ExistRelationsModel {
    data: any;
    collectionName: string;
}

export interface CheckValidOption {
    data: any;
    collectionName: string;
    locale: string;
    id?: string;
    type?: string;
}

@Injectable()
export class CommonService extends EntitiesService {
    public readonly logger = new Logger(CommonService.name);
    constructor(
        @InjectConnection() public readonly connection: Connection
    ) {
        super(connection);
    }

    // async checkExit(existRelationsModel: ExistRelationsModel) {
    //     const { collectionName, data } = existRelationsModel;

    //     if (!collectionName) {
    //         throw new UnprocessableEntityException(
    //             'Collection name is required',
    //         );
    //     }

    //     const collection = await this.getModel(
    //         COLLECTION_NAME.CUSTOM_POST,
    //     ).findOne({
    //         is_entity: true,
    //         key: collectionName,
    //     });

    //     if (!collection) {
    //         return;
    //     }

    //     const { relations } = collection;

    //     for (const relation of relations) {
    //         const { embeddedType, ...rest } = relation;

    //         if (embeddedType === EMBEDDED_TYPE.ONE_TO_ONE) {
    //             await this.existRelationsEmbeddedOneToOne(data, rest);
    //         }

    //         if (embeddedType === EMBEDDED_TYPE.ONE_TO_MANY) {
    //             await this.existRelationsEmbeddedOneToMany(data, rest);
    //         }

    //         if (embeddedType === EMBEDDED_TYPE.ONE_TO_MANY_PROPERTY) {
    //             await this.existRelationsEmbeddedOneToManyProperty(data, rest);
    //         }
    //     }
    // }
}