import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import moment from "moment-timezone";
import { Document } from "mongoose";
import { appSettings } from "src/configs/app.config";
import { COLLECTION_NAME } from "src/cores/__schema__/configs/enum";
import { Property } from "src/cores/decorators/property.decorator";

@Schema({
    timestamps: {
        currentTime: () => moment().tz(appSettings.timezone).toDate(),
    },
    collection: COLLECTION_NAME.PERMISSION
})
export class Permissions extends Document {
    @Property({ type: String.name })
    @Prop({ type: String, required: true })
    name: string;

    @Property({ type: String.name })
    @Prop({ type: String, required: true })
    entityName: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permissions);