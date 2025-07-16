import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import moment from "moment-timezone";
import { Document, Types } from "mongoose";
import { AggregateRootMixin } from "src/common/models/root/aggregate-root";
import { appSettings } from "src/configs/app.config";
import { COLLECTION_NAME } from "src/cores/__schema__/configs/enum";
import { Property } from "src/cores/decorators/property.decorator";

@Schema({
    timestamps: {
        currentTime: () => moment().tz(appSettings.timezone).toDate(),
    },
    collection: COLLECTION_NAME.ENTITY
})
export class Entity extends AggregateRootMixin(Document) {
    @Property({ type: String.name })
    @Prop({ type: String, required: true })
    name: string;

    @Property({ type: String.name })
    @Prop({ type: String })
    description: string;

    @Property({ type: Object.name })
    @Prop({ type: Object, required: true })
    jsonSchema: Record<string, any>;

    @Property({ type: Object.name })

    @Prop({ type: Object, default: {} })
    uiSchema: Record<string, any>;

    @Property({ type: Types.ObjectId.name, ref: COLLECTION_NAME.GROUP_ENTITY })
    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAME.GROUP_ENTITY })
    groupEntity: Types.ObjectId;

}

export const EntitySchema = SchemaFactory.createForClass(Entity);
