import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import moment from "moment-timezone";
import { Document } from "mongoose";
import { TENANT_TYPE } from "src/common/contants/enum";
import { appSettings } from "src/configs/app.config";
import { COLLECTION_NAME } from "src/cores/__schema__/configs/enum";
import { Property } from "src/cores/decorators/property.decorator";

@Schema(
    {
        timestamps: {
            currentTime: () => moment().tz(appSettings.timezone).toDate(),
        },
        collection: COLLECTION_NAME.TENANT
    }
)
export class Tenant extends Document {
    @Property({ type: String.name })
    @Prop({ type: String, unique: true })
    name: string;

    @Property({ type: Boolean.name })
    @Prop({ type: Boolean, default: false })
    isRoot: boolean;

    @Property({ type: String.name })
    @Prop({
        type: String,
        enum: TENANT_TYPE,
        default: TENANT_TYPE.PUBLIC
    })
    type: TENANT_TYPE;

    @Property({ type: Boolean.name })
    @Prop({ type: Boolean, default: false })
    isActive: boolean;

    @Property({ type: String.name })
    @Prop({ type: String, default: '' })
    description: string;

    @Property({ type: String.name })
    @Prop({ type: String, default: '' })
    domain: string;

    @Property({ type: Object })
    @Prop({ type: Object, default: {} })
    settings: Record<string, any>;
}
export const TenantSchema = SchemaFactory.createForClass(Tenant);