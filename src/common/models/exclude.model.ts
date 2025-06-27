import { Exclude } from 'class-transformer';

export class ExcludeModel {

    @Exclude()
    createdAt: Date;

    @Exclude()
    updatedAt: Date;

    @Exclude()
    _id: string;

    @Exclude()
    createdBy: string;

    @Exclude()
    updatedBy: string;

    @Exclude()
    deletedBy: string;

    @Exclude()
    deletedAt: Date | null;
}
