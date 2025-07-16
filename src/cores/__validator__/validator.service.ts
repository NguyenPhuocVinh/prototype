import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { EntitiesService } from "../services/entities.service";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { ModelsService } from "src/apis/models/models.service";
import _ from "lodash";

export interface ValidatorBodyOptions {
    collectionName: string;
    method: string;
    url: string;
    body: any;
    options?: {
        skipMissing?: boolean;
        skipExtra?: boolean;
    };
}

@Injectable()
export class ValidatorService extends EntitiesService {
    public readonly logger = new Logger(ValidatorService.name);
    constructor(
        @InjectConnection() public readonly connection: Connection,
    ) {
        super(connection);
    }

    async validateBody(
        validatorBodyDecoratorOptions: ValidatorBodyOptions
    ): Promise<any> {
        const { collectionName, body, url, options, method } = validatorBodyDecoratorOptions;
        const model = this.getModel(collectionName);
        if (!model) {
            throw new Error(`Model for collection ${collectionName} not found`);
        }

        const document = await model.findOne(
            {
                url,
                method: method.toLowerCase(),
            }
        )

        try {
            this.validateAgainstBodySchema(
                document.body,
                body
            )
        } catch (error: any) {
            this.logger.error(`Validation failed for ${collectionName}: ${error.message}`);
            throw error;
        }
    }


    private validateAgainstBodySchema(
        documentBody: Record<string, any>,
        payload: Record<string, any>,
    ): void {
        const errors: {
            property: string;
            constraints: Record<string, string>;
        }[] = [];

        _.forEach(documentBody, (config, field) => {
            const value = _.get(payload, field);
            const expectedType = _.toLower(config?.type);
            const isRequired = _.get(config, 'required', false);

            const constraints: Record<string, string> = {};

            // Required check
            if (isRequired && _.isNil(value)) {
                constraints['isDefined'] = `${field} should not be null or undefined`;
            } else if (!_.isNil(value)) {
                // Type check
                switch (expectedType) {
                    case 'string':
                        if (!_.isString(value)) {
                            constraints['isString'] = `${field} must be a string`;
                        }
                        break;
                    case 'number':
                        if (!_.isNumber(value) && isNaN(Number(value))) {
                            constraints['isNumber'] = `${field} must be a number`;
                        }
                        break;
                    case 'boolean':
                        if (!_.isBoolean(value)) {
                            constraints['isBoolean'] = `${field} must be a boolean`;
                        }
                        break;
                    case 'date':
                        if (!_.isString(value) || isNaN(Date.parse(value))) {
                            constraints['isDateString'] = `${field} must be a valid ISO 8601 date string`;
                        }
                        break;
                }
            }

            if (Object.keys(constraints).length > 0) {
                errors.push({ property: field, constraints });
            }
        });

        if (errors.length > 0) {
            throw new BadRequestException(errors);
        }
    }
}