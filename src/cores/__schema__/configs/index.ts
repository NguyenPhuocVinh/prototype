import { Types } from "mongoose";
import { CreatedByRoot } from "src/common/models/root/created-by-root";
import { FileRoot } from "src/common/models/root/file-root";
import { RelationRoot } from "src/common/models/root/relation-root";
import { EMBEDDED_TYPE } from "src/cores/event-handler/constants";

export const getEmbeddedType = (fieldName: string, propertyType: any) => {
    if (propertyType === RelationRoot.name) {
        if (fieldName.split('.').length === 1) {
            return EMBEDDED_TYPE.ONE_TO_ONE;
        } else {
            return EMBEDDED_TYPE.ONE_TO_ONE_PROPERTY;
        }
    } else if (
        Array.isArray(propertyType) &&
        propertyType.includes(RelationRoot.name)
    ) {
        if (fieldName.split('.').length === 1) {
            return EMBEDDED_TYPE.ONE_TO_MANY;
        } else {
            return EMBEDDED_TYPE.ONE_TO_MANY_PROPERTY;
        }
    } else if (propertyType === CreatedByRoot.name) {
        if (fieldName.split('.').length === 1) {
            return EMBEDDED_TYPE.ONE_TO_ONE;
        } else {
            return EMBEDDED_TYPE.ONE_TO_ONE_PROPERTY;
        }
    } else if (
        Array.isArray(propertyType) &&
        propertyType.includes(CreatedByRoot.name)
    ) {
        if (fieldName.split('.').length === 1) {
            return EMBEDDED_TYPE.ONE_TO_MANY;
        } else {
            return EMBEDDED_TYPE.ONE_TO_MANY_PROPERTY;
        }
    } else if (propertyType === FileRoot.name) {
        if (fieldName.split('.').length === 1) {
            return EMBEDDED_TYPE.ONE_TO_ONE;
        } else {
            return EMBEDDED_TYPE.ONE_TO_ONE_PROPERTY;
        }
    } else if (
        Array.isArray(propertyType) &&
        propertyType.includes(FileRoot.name)
    ) {
        if (fieldName.split('.').length === 1) {
            return EMBEDDED_TYPE.ONE_TO_MANY;
        } else {
            return EMBEDDED_TYPE.ONE_TO_MANY_PROPERTY;
        }
    } else if (Array.isArray(propertyType) && propertyType.includes(Types.ObjectId.name)) {
        if (fieldName.split('.').length === 1) {
            return EMBEDDED_TYPE.ONE_TO_MANY;
        } else {
            return EMBEDDED_TYPE.ONE_TO_MANY_PROPERTY;
        }
    } else if (propertyType === Types.ObjectId.name) {
        if (fieldName.split('.').length === 1) {
            return EMBEDDED_TYPE.ONE_TO_ONE;
        } else {
            return EMBEDDED_TYPE.ONE_TO_ONE_PROPERTY;
        }

    } else {
        return null;
    }
};

export const relationsJsonSchema = (jsonSchema: any): any[] => {
    const relations = [];

    if (!jsonSchema?.properties) return relations;

    for (const [key, value] of Object.entries(jsonSchema.properties)) {
        const field = value as any;

        if (
            field.type === 'object' &&
            typeof field.$ref === 'string'
        ) {
            const embeddedType = getEmbeddedType(key, 'object');
            relations.push({
                [field.$ref]: key,
                embeddedType,
            });
        }

        else if (
            field.type === 'array' &&
            field.items?.$ref
        ) {
            const embeddedType = getEmbeddedType(key, ['object']);
            relations.push({
                [field.items.$ref]: key,
                embeddedType,
            });
        }
    }

    return relations;
};