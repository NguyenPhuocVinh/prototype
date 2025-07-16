import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import _ from "lodash";
import moment from "moment-timezone";
import { Document, Types } from "mongoose";
import { API_TYPE, HTTP_METHOD } from "src/common/contants/enum";
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
    collection: COLLECTION_NAME.GENERATE_APIS
})
export class GenerateApis extends AggregateRootMixin(Document) {
    @Property({ type: String.name })
    @Prop({ type: String, required: true })
    name: string;

    @Property({ type: String.name })
    @Prop({ type: String })
    description: string;

    @Property({ type: String.name })
    @Prop({ type: String, required: true })
    url: string;

    @Property({ type: String.name })
    @Prop({ type: String, enum: HTTP_METHOD, required: true })
    method: HTTP_METHOD;

    @Property({ type: String.name })
    @Prop({ type: String, enum: API_TYPE, required: true })
    type: API_TYPE

    @Property({ type: Types.ObjectId.name, ref: COLLECTION_NAME.ENTITY })
    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAME.ENTITY, required: true })
    entity: Types.ObjectId;

    @Property({ type: Object.name })
    @Prop({
        type: Object,
        default: {},
        description: 'Các headers cần gửi kèm',
    })
    headers: Record<string, string>

    @Property({ type: Object.name })
    @Prop({
        type: Object,
        default: {},
        description: 'Các tham số trong URL, ví dụ: /users/:id -> { id: "string" }',
    })
    params: Record<string, string>;

    @Property({ type: Object.name })
    @Prop({
        type: Object,
        default: {},
        description: 'Các query string, ví dụ: /users?page=1 -> { page: "number" }',
    })
    query: Record<string, string>;

    @Property({ type: Boolean.name })
    @Prop({
        type: Boolean,
        default: false,
        description: 'Có yêu cầu xác thực không',
    })
    requireAuth: boolean;

    @Property({ type: Object.name })
    @Prop({
        type: Object,
        default: {},
        description: 'Body payload nếu là POST/PUT',
    })
    body: Record<string, any>;
}
export const GenerateApisSchema = SchemaFactory.createForClass(GenerateApis);

GenerateApisSchema.set('toJSON', {
    virtuals: true,
});

GenerateApisSchema.pre('save', function (next) {
    this.createdBy = transferValueCreatedBy(this.createdBy);
    next();
});

GenerateApisSchema.pre('updateOne', function (next) {
    const update = this.getUpdate() as GenerateApis;
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
});