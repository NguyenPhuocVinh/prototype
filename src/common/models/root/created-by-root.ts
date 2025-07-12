import { Types } from "mongoose";
import { RelationRoot } from "./relation-root";

export class CreatedBy {
    _id: Types.ObjectId;
    lastName: string;
    firstName: string;
    fullName?: string;
    phone?: string;
    email: string;
    role: Types.ObjectId;
    rules?: number[];
    rulePermissions?: { [key: string]: string };
    tenant?: Types.ObjectId;
}


export class CreatedByRoot {
    _id: Types.ObjectId;
    lastName: string;
    firstName: string;
    email: string;
}

export const createdByPick = ['_id', 'lastName', 'firstName', 'email', 'phone'];