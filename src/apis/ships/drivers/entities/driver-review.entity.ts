import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import moment from "moment-timezone";
import { Document, Types } from "mongoose";
import { isObjectAndNotEmpty } from "src/common/func-helper/check-valid";
import { transferValuePathImage } from "src/common/func-helper/transfer-vale-relations";
import { FileRoot } from "src/common/models/root/file-root";
import { appSettings } from "src/configs/app.config";
import { COLLECTION_NAME } from "src/cores/__schema__/configs/enum";
import { Property } from "src/cores/decorators/property.decorator";

@Schema({
    timestamps: {
        currentTime: () => moment().tz(appSettings.timezone).toDate(),
    },
    collection: COLLECTION_NAME.DRIVER_REVIEW,
})
export class DriverReview extends Document {
    @Property({ type: Types.ObjectId.name, ref: COLLECTION_NAME.USER })
    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAME.DRIVER })
    user: Types.ObjectId;

    @Property({ type: Types.ObjectId.name, ref: COLLECTION_NAME.DRIVER })
    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAME.DRIVER })
    driver: Types.ObjectId;

    @Property({ type: String.name })
    @Prop({ type: String, required: true })
    content: string;

    @Property({ type: Number.name })
    @Prop({ type: Number, required: true })
    rating: number;
}
export const DriverReivewSchema = SchemaFactory.createForClass(DriverReview);

