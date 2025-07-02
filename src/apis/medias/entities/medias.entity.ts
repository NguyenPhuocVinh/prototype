import _ from 'lodash';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { UUID } from 'bson';
import { Document } from 'mongoose';
import moment from 'moment-timezone';
import { Property } from 'src/cores/decorators/property.decorator';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { AggregateRootMixin } from 'src/common/models/root/aggregate-root';
import { RelationRoot } from 'src/common/models/root/relation-root';
import { appSettings } from 'src/configs/app.config';
import { isObjectAndNotEmpty } from 'src/common/func-helper/check-valid';
import { transferValueCreatedBy, transferValueCreatedByToName, transferValuePathImage } from 'src/common/func-helper/transfer-vale-relations';

@Schema({
    timestamps: {
        currentTime: () => moment().tz(appSettings.timezone).toDate(),
    },
    collection: COLLECTION_NAME.FILE,
})
export class File extends AggregateRootMixin(Document) {
    @Property({ type: [RelationRoot.name], ref: COLLECTION_NAME.CATEGORY })
    @Prop({ type: [Object] })
    categories: RelationRoot[];

    @Property({ type: String.name })
    @Prop({ type: String })
    filename: string;

    @Property({ type: String.name })
    @Prop({ type: String })
    disk: string;

    @Property({ type: String.name })
    @Prop({ type: String })
    note: string;

    @Property({ type: String.name })
    @Prop({ type: String })
    path: string;

    @Property({ type: String.name })
    @Prop({ type: String })
    extension: string;

    @Property({ type: String.name })
    @Prop({ type: String })
    mime: string;

    @Property({ type: Number.name })
    @Prop({ type: Number })
    size: number;

    @Property({ type: String.name })
    @Prop({ type: String })
    title: string;

    @Property({ type: String.name })
    @Prop({ type: String })
    filePath: string;

    @Property({ type: String.name })
    @Prop({ type: String })
    alt: string;

    @Property({ type: String.name })
    @Prop({ default: '', type: String })
    shortDescription: string;
}

export const FileSchema = SchemaFactory.createForClass(File);

FileSchema.virtual('folder').get(function () {
    if (this.categories?.length > 0) {
        return this.categories;
    }
    return [];
});


FileSchema.set('toJSON', { virtuals: true });

FileSchema.post('find', function (docs, next) {
    docs.forEach((doc) => {
        if (isObjectAndNotEmpty(doc)) {
            doc.path = transferValuePathImage(doc);
        }

        if (isObjectAndNotEmpty(doc?.createdBy)) {
            doc.createdBy = transferValueCreatedByToName(doc.createdBy);
        }

        if (_.size(doc?.categories) > 0) {
            doc.folder = doc?.categories;
        }

        if (_.size(doc?.session_tags?.tags) > 0) {
            doc.tags = doc?.session_tags?.tags;
        }
    });
    next();
});

FileSchema.post('findOne', function (doc, next) {
    if (isObjectAndNotEmpty(doc)) {
        doc.path = transferValuePathImage(doc);
    }

    if (isObjectAndNotEmpty(doc?.createdBy)) {
        doc.createdBy = transferValueCreatedByToName(doc.createdBy);
    }

    if (_.size(doc?.categories) > 0) {
        doc.folder = doc?.categories;
    }

    if (_.size(doc?.session_tags?.tags) > 0) {
        doc.tags = doc?.session_tags?.tags;
    }

    next();
});

FileSchema.pre('save', function (next) {
    this.createdBy = transferValueCreatedBy(this.createdBy);

    next();
});

FileSchema.pre('updateOne', function (next) {
    const update = this.getUpdate();
    const path = _.get(update, 'path', null);
    const createdBy = _.get(update, 'createdBy', null);

    if (path) {
        // update['path'] = path.replace(appSettings.doSpace.public, '');
    }

    if (isObjectAndNotEmpty(createdBy)) {
        update['createdBy'] = transferValueCreatedBy(createdBy);
    }

    next();
});
