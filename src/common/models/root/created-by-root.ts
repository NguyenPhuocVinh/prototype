import { Types } from "mongoose";
import { RelationRoot } from "./relation-root";

export class CreatedBy {
    _id: Types.ObjectId;
    lastName: string;
    firstName: string;
    email: string;
    role: RelationRoot[];
    rules?: number[];
    rulePermissions?: { [key: string]: string };
}


export class CreatedByRoot {
    _id: Types.ObjectId;
    lastName: string;
    firstName: string;
    email: string;
}

export const createdByPick = ['_id', 'lastName', 'firstName', 'email', 'phone'];