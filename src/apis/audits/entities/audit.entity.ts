import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import _ from "lodash";
import moment from "moment-timezone";
import { Document } from "mongoose";
import { isObjectAndNotEmpty } from "src/common/func-helper/check-valid";
import { transferValueCreatedBy, transferValueCreatedByToName } from "src/common/func-helper/transfer-vale-relations";
import { CreatedByRoot } from "src/common/models/root/created-by-root";
import { appSettings } from "src/configs/app.config";
import { COLLECTION_NAME } from "src/cores/__schema__/configs/enum";
import { Property } from "src/cores/decorators/property.decorator";

@Schema({
    timestamps: {
        currentTime: () => moment().tz(appSettings.timezone).toDate(),
    },
    collection: COLLECTION_NAME.AUDIT,
})
export class Audit extends Document {
    @Property({ type: String.name })
    @Prop({ type: String })
    targetId: string;

    @Property({ type: String.name })
    @Prop({ type: String })
    event: string;

    @Property({ type: String.name })
    @Prop({ type: String })
    url: string;

    @Property({ type: String.name })
    @Prop({ type: String })
    targetType: string;

    @Property({ type: String.name })
    @Prop({ type: String })
    ipAddress: string;

    @Property({ type: String.name })
    @Prop({ type: String })
    userAgent: string;

    @Property({ type: String.name })
    @Prop({ type: String })
    userFullname: string;

    @Property({ type: Object.name })
    @Prop({ type: Object, default: {} })
    createdBy: CreatedByRoot;

    @Property({ type: Object.name })
    @Prop({ type: Object, default: {} })
    oldValues: any;

    @Property({ type: Object.name })
    @Prop({ type: Object, default: {} })
    newValues: any;

    @Property({ type: Object.name })
    @Prop({ type: Object, default: {} })
    body: any;
}

export const AuditSchema = SchemaFactory.createForClass(Audit);

AuditSchema.pre('save', function (next) {
    if (isObjectAndNotEmpty(this.createdBy)) {
        this.createdBy = transferValueCreatedBy(this.createdBy);
    }
    next();
});

AuditSchema.pre('updateOne', function (next) {
    const update = this.getUpdate();
    const createdBy = _.get(update, 'createdBy', null);

    if (isObjectAndNotEmpty(createdBy)) {
        update['createdBy'] = transferValueCreatedBy(createdBy);
    }
    next();
});

AuditSchema.post('find', function (docs, next) {
    docs.forEach((doc) => {
        if (isObjectAndNotEmpty(doc?.createdBy)) {
            doc.userFullname = transferValueCreatedByToName(doc.createdBy);
        }
    });
    next();
});

AuditSchema.post('findOne', function (doc, next) {
    if (isObjectAndNotEmpty(doc?.createdBy)) {
        doc.userFullname = transferValueCreatedByToName(doc.createdBy);
    }
    next();
});
