import { Types } from "mongoose";

export class CreatedBy {
    _id: Types.ObjectId;
    id: string;
    last_name: string;
    first_name: string;
    email: string;
    // roles: RelationRoot[];
    rules?: number[];
    rulePermissions?: { [key: string]: string };
    // tenant: ITenant[];
    tenant: string;
}


export class CreatedByRoot {
    _id: Types.ObjectId;
    id: string;
    last_name: string;
    first_name: string;
    email: string;
}

export const createdByPick = ['_id', 'id', 'last_name', 'first_name', 'email'];