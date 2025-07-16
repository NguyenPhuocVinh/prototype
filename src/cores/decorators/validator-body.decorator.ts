import { SetMetadata } from '@nestjs/common';

export const VALIDATOR_BODY_DATA = 'VALIDATOR_BODY_DATA';

export interface ValidatorBodyDecoratorOptions {
    collectionName?: string;
    options?: {
        skipMissing?: boolean;
        skipExtra?: boolean;
    };
}

export const ValidatorBodyDecorator = (
    options: ValidatorBodyDecoratorOptions = {},
) => SetMetadata(VALIDATOR_BODY_DATA, options);
