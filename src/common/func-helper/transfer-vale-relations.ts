import { UnprocessableEntityException } from "@nestjs/common";
import { createdByPick, CreatedByRoot } from "../models/root/created-by-root";
import { isObjectAndNotEmpty } from "./check-valid";
import { Types } from "mongoose";
import _ from "lodash";
import { RelationRoot, relationRootPick } from "../models/root/relation-root";
import { appSettings } from "src/configs/app.config";
import { File } from "src/apis/medias/entities/medias.entity";
import { filePick, FileRoot } from "../models/root/file-root";

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

export const transferValuePathImage = (file: File): string => {
    const { path, disk } = file;
    return `${appSettings.cloudinary.url}/${path}`;
};

export const transferValueFile = (file: FileRoot): FileRoot => {
    if (!isObjectAndNotEmpty(file)) {
        return file;
    }

    const _id = _.get(file, '_id', null);

    if (!Types.ObjectId.isValid(_id)) {
        throw new UnprocessableEntityException(
            'The _id is not a valid ObjectId',
        );
    }

    const path = _.get(file, 'path', '');
    const paths = path.split('/');

    const result = {
        ...file,
        _id: new Types.ObjectId(file._id),
        path: `${paths[paths.length - 2]}/${paths[paths.length - 1]}`,
    };

    if (result['disk'] === 'ckfinder') {
        try {
            const urlObject = new URL(path);
            const pathname = urlObject.pathname;
            const relativePath = '/' + pathname.substring(1);
            result['path'] = relativePath;
        } catch (e) {
            result['path'] = path;
        }
    }

    return _.pick(result, filePick) as FileRoot;
};