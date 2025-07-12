import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import _ from "lodash";
import moment from "moment-timezone";
import { Document, Types } from "mongoose";
import { isObjectAndNotEmpty } from "src/common/func-helper/check-valid";
import { transferValueCreatedBy, transferValuePathImage } from "src/common/func-helper/transfer-vale-relations";
import { AggregateRootMixin } from "src/common/models/root/aggregate-root";
import { FileRoot } from "src/common/models/root/file-root";
import { appSettings } from "src/configs/app.config";
import { COLLECTION_NAME } from "src/cores/__schema__/configs/enum";
import { Property } from "src/cores/decorators/property.decorator";
import { EMBEDDED_TYPE } from "src/cores/event-handler/constants";

export class Relation {
    [key: string]: string;
    embeddedType: EMBEDDED_TYPE;
}

@Schema({
    timestamps: {
        currentTime: () => moment().tz(appSettings.timezone).toDate(),
    },
    collection: COLLECTION_NAME.ENTITY_RELATION,
})
export class EntityRelation extends AggregateRootMixin(Document) {
    @Property({ type: String.name })
    @Prop({
        unique: true,
    })
    key: string;

    @Property({ type: String.name })
    @Prop()
    name: string;

    @Property({ type: [Object.name] })
    @Prop({ type: [Relation] })
    relations: Relation[];

}
export const EntityRelationSchema = SchemaFactory.createForClass(EntityRelation);


EntityRelationSchema.pre('save', function (next) {
    this.createdBy = transferValueCreatedBy(this.createdBy);
    next();
});

EntityRelationSchema.pre('updateOne', function (next) {
    const update = this.getUpdate();
    const createdBy = _.get(update, 'createdBy', null);

    if (isObjectAndNotEmpty(createdBy)) {
        update['createdBy'] = transferValueCreatedBy(createdBy);
    }
    next();
});