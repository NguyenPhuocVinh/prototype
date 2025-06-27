import { UnprocessableEntityException } from "@nestjs/common";
import { createdByPick, CreatedByRoot } from "../models/root/created-by-root";
import { isObjectAndNotEmpty } from "./check-valid";
import { Types } from "mongoose";
import _ from "lodash";

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