import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import _ from "lodash";
import moment from "moment-timezone";
import { Document, Types } from "mongoose";
import { isObjectAndNotEmpty } from "src/common/func-helper/check-valid";
import { transferValueCreatedBy } from "src/common/func-helper/transfer-vale-relations";
import { AggregateRootMixin } from "src/common/models/root/aggregate-root";
import { appSettings } from "src/configs/app.config";
import { COLLECTION_NAME } from "src/cores/__schema__/configs/enum";
import { Property } from "src/cores/decorators/property.decorator";

@Schema({
    timestamps: {
        currentTime: () => moment().tz(appSettings.timezone).toDate(),
    },
    collection: COLLECTION_NAME.GROUP_ENTITY
})
export class GroupEntity extends AggregateRootMixin(Document) {
    @Property({ type: String.name })
    @Prop({ type: String, required: true })
    name: string;

    @Property({ type: String.name })
    @Prop({ type: String })
    description: string;
}
export const GroupEntitySchema = SchemaFactory.createForClass(GroupEntity);

GroupEntitySchema.set('toJSON', {
    virtuals: true,
});

GroupEntitySchema.pre('save', function (next) {
    this.createdBy = transferValueCreatedBy(this.createdBy)
    next();
})

GroupEntitySchema.pre('updateOne', function (next) {
    const update = this.getUpdate() as GroupEntity;
    const slug = _.get(update, 'slug', null);
    const createdBy = _.get(update, 'createdBy', null);
    const updatedBy = _.get(update, 'updatedBy', null);
    if (isObjectAndNotEmpty(createdBy)) {
        update['createdBy'] = transferValueCreatedBy(createdBy);
    }
    if (isObjectAndNotEmpty(updatedBy)) {
        update['updatedBy'] = transferValueCreatedBy(updatedBy);
    }
    next();
})