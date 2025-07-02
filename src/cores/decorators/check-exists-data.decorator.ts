import { SetMetadata } from '@nestjs/common';
export const CHECK_EXISTS_DATA = 'CHECK_EXISTS_DATA';

export interface CheckExitDataDecoratorOptions {
    collectionName: string;
}

export const CheckExitDataDecorator = (option: CheckExitDataDecoratorOptions) =>
    SetMetadata(CHECK_EXISTS_DATA, option);
