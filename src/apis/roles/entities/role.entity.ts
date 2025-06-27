import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import moment from "moment-timezone";
import { Document, SchemaType, SchemaTypes, Types } from "mongoose";
import { appSettings } from "src/configs/app.config";
import { COLLECTION_NAME } from "src/cores/__schema__/configs/enum";

@Schema({
    timestamps: {
        currentTime: () => moment().tz(appSettings.timezone).toDate(),
    },
    collection: COLLECTION_NAME.ROLE
})
export class Role extends Document {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String })
    description: string;

    @Prop({ type: SchemaTypes.ObjectId, ref: COLLECTION_NAME.PERMISSION })
    permissions: Types.ObjectId[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);