import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import moment from "moment-timezone";
import { Document } from "mongoose";
import { COLLECTION_NAME, TENANT_TYPE } from "src/common/contants/enum";
import { appSettings } from "src/configs/app.config";

@Schema({
    timestamps: {
        currentTime: () => moment.tz(appSettings.timezone).toDate(),
    },
    collection: COLLECTION_NAME.TENANT
})
export class Tenant extends Document {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ enum: TENANT_TYPE, default: TENANT_TYPE.PRIVATE })
    type: TENANT_TYPE;

    @Prop({ type: Boolean, default: false })
    isRoot: boolean;

    @Prop({ type: String })
    slug: string;

    @Prop({ type: String })
    domain: string;

    @Prop({ type: Object, default: {} })
    settings: Record<string, any>;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);