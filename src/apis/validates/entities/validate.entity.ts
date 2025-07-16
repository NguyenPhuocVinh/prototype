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
    collection: COLLECTION_NAME.VALIDATE
})
export class Validates extends AggregateRootMixin(Document) {
    @Property({ type: String.name })
    @Prop({ type: String, required: true })
    name: string;

    @Property({ type: String.name })
    @Prop({ type: String, required: true })
    description: string;

    @Property({ type: String.name })
    @Prop({ type: String, required: true })
    collectionName: string;

    @Property({ type: String.name })
    @Prop({ type: String, enum: ['and', 'or'], required: true })
    logical: string;

    @Property({ type: Object.name })
    @Prop({
        type: Object,
        description: 'Các điều kiện lọc dữ liệu, ví dụ: { "name": "John", "age": { "$gt": 30 } }',
    })
    conditions: Record<string, any>;

    @Property({ type: Object.name })
    @Prop({
        type: Object,
        default: {},
        description: 'Các trường cần lấy, ví dụ: { "name": 1, "age": 1 }',
    })
    fields: Record<string, any>;

    @Property({ type: Array.name })
    @Prop({
        type: [Object],
        default: [],
        description: 'Các trường cần sắp xếp, ví dụ: [{ "name": 1 }, { "age": -1 }]',
    })
    pipeline: Record<string, any>[];

    @Property({ type: Types.ObjectId.name, ref: COLLECTION_NAME.ENTITY })
    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAME.ENTITY })
    entity: Types.ObjectId;

    @Property({ type: Types.ObjectId.name })
    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAME.GENERATE_APIS, default: null })
    generateApi: Types.ObjectId;
}
export const ValidateSchema = SchemaFactory.createForClass(Validates);