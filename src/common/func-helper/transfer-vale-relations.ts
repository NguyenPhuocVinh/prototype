import { UnprocessableEntityException } from "@nestjs/common";
import { createdByPick, CreatedByRoot } from "../models/root/created-by-root";
import { isObjectAndNotEmpty } from "./check-valid";
import { Types } from "mongoose";
import _ from "lodash";
import { RelationRoot, relationRootPick } from "../models/root/relation-root";
import { appSettings } from "src/configs/app.config";
import { Media } from "src/apis/medias/entities/medias.entity";

export const transferValueCreatedBy = (
    createdBy: CreatedByRoot,
): CreatedByRoot => {
    if (!isObjectAndNotEmpty(createdBy)) {
        return createdBy;
    }

    const modifiedCreatedBy = _.pick(
        createdBy,
        createdByPick,
    ) as CreatedByRoot;

    const _id = _.get(createdBy, '_id', null);

    if (_id) {
        if (!Types.ObjectId.isValid(_id)) {
            throw new UnprocessableEntityException(
                'The _id is not a valid ObjectId',
            );
        }
        modifiedCreatedBy._id = new Types.ObjectId(createdBy._id);
    }

    return modifiedCreatedBy;
};

export const transferValueCreatedByToName = (
    createdBy: CreatedByRoot,
): string => {
    return `${createdBy?.firstName} ${createdBy?.lastName}`;
};

export const transferValueRelations = (
    values: object[],
): RelationRoot[] | any => {
    if (!Array.isArray(values) || _.size(values) === 0) {
        return values;
    }

    const result = values
        .map((value) => {
            if (isObjectAndNotEmpty(value)) {
                const _id = _.get(value, '_id', null);

                if (!Types.ObjectId.isValid(_id)) {
                    throw new UnprocessableEntityException(
                        'The _id is not a valid ObjectId',
                    );
                }

                const relationRoot = _.pick(
                    value,
                    relationRootPick,
                ) as RelationRoot;

                return {
                    ...relationRoot,
                    _id: new Types.ObjectId(_id),
                };
            }
        })
        .filter((item) => item !== undefined);

    return result;
};

export const transferValuePathImage = (featured_image: Media): string => {
    const { path, disk } = featured_image;
    return `${appSettings.cloudinary.url}/${path}`;
};