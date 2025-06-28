import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import _ from "lodash";
import moment from "moment-timezone";
import { Document, SchemaType, SchemaTypes, Types } from "mongoose";
import { isObjectAndNotEmpty } from "src/common/func-helper/check-valid";
import { transferValueCreatedBy, transferValueCreatedByToName } from "src/common/func-helper/transfer-vale-relations";
import { AggregateRootMixin } from "src/common/models/root/aggregate-root";
import { RelationRoot } from "src/common/models/root/relation-root";
import { appSettings } from "src/configs/app.config";
import { COLLECTION_NAME } from "src/cores/__schema__/configs/enum";
import { Property } from "src/cores/decorators/property.decorator";

@Schema({
    timestamps: {
        currentTime: () => moment().tz(appSettings.timezone).toDate(),
    },
    collection: COLLECTION_NAME.ROLE
})
export class Role extends AggregateRootMixin(Document) {
    @Property({ type: String.name })
    @Prop({ type: String, required: true })
    name: string;

    @Property({ type: String.name })
    @Prop({ type: String })
    description: string;

    @Prop({ type: [Types.ObjectId], ref: COLLECTION_NAME.PERMISSION })
    permissions: Types.ObjectId[];

    @Property({ type: Types.ObjectId.name })
    @Prop({ type: [Types.ObjectId], ref: COLLECTION_NAME.RULE, default: [] })
    rules: Types.ObjectId[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.post('find', function (docs, next) {
    docs.forEach((doc) => {
        if (isObjectAndNotEmpty(doc?.createdBy)) {
            doc.createdBy = transferValueCreatedByToName(doc.createdBy);
        }
    });
    next();
});

RoleSchema.post('findOne', function (doc, next) {
    if (isObjectAndNotEmpty(doc?.createdBy)) {
        doc.createdBy = transferValueCreatedByToName(doc.createdBy);
    }
    next();
});

RoleSchema.pre('save', function (next) {
    this.createdBy = transferValueCreatedBy(this.createdBy);

    next();
});

RoleSchema.pre('updateOne', function (next) {
    const update = this.getUpdate();
    const createdBy = _.get(update, 'createdBy', null);

    if (isObjectAndNotEmpty(createdBy)) {
        update['createdBy'] = transferValueCreatedBy(createdBy);
    }
    next();
});
