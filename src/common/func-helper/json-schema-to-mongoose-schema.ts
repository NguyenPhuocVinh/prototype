import { Schema } from 'mongoose';
import _ from 'lodash';

interface JsonSchemaProperty {
    type?: string | string[];
    format?: string;
    unique?: boolean;
    items?: JsonSchemaProperty;
    properties?: Record<string, JsonSchemaProperty>;
    [key: string]: any;
}

interface IFieldConfig {
    type: any;
    required?: boolean;
    unique?: boolean;
    index?: boolean;
    [key: string]: any;
}

export const jsonSchemaToMongooseSchema = (jsonSchema: any): Schema => {
    const mongooseSchemaDef: Record<string, any> = {};

    if (!_.isPlainObject(jsonSchema?.properties)) {
        throw new Error('Invalid JSON schema: missing properties');
    }

    const requiredFields: string[] = _.get(jsonSchema, 'required', []);

    const properties = jsonSchema.properties as Record<string, JsonSchemaProperty>;

    _.forEach(properties, (prop, key) => {
        const type = _.get(prop, 'type', 'string');
        const isRequired = requiredFields.includes(key);
        const isUnique = _.get(prop, 'unique', false);

        let fieldType: any = String;

        switch (type) {
            case 'string':
                fieldType = String;
                break;
            case 'number':
                fieldType = Number;
                break;
            case 'boolean':
                fieldType = Boolean;
                break;
            case 'date':
                fieldType = Date;
                break;
            case 'object':
                fieldType = Object;
                break;
            case 'array':
                fieldType = [String];
                break;
            default:
                fieldType = String;
                break;
        }

        const fieldConfig: IFieldConfig = {
            type: fieldType,
            required: isRequired,
        };

        if (isUnique) {
            fieldConfig.unique = true;
            fieldConfig.index = true;
        }

        mongooseSchemaDef[key] = fieldConfig;
    });

    return new Schema(mongooseSchemaDef);
};
