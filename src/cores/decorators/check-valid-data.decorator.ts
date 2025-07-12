import { SetMetadata } from '@nestjs/common';
export const CHECK_VALID_DATA = 'CHECK_VALID_DATA';

export interface CheckValidDataDecoratorOptions {
    collectionName: string;
}

export const CheckValidDataDecorator = (
    option: CheckValidDataDecoratorOptions,
) => SetMetadata(CHECK_VALID_DATA, option);
