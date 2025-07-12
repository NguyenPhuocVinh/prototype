import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import _ from "lodash";
import moment from "moment-timezone";
import { Document, SchemaTypes, Types, UpdateQuery } from "mongoose";
import { COLLECTION_NAME } from "src/cores/__schema__/configs/enum";
import { appSettings } from "src/configs/app.config";

@Schema({
    timestamps: {
        currentTime: () => moment().tz(appSettings.timezone).toDate(),
    },
    collection: COLLECTION_NAME.STORE
})
export class Store extends Document {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String })
    description: string;

    @Prop({ type: String, unique: true, })
    slug: string;

    @Prop({ type: String })
    province: string;

    @Prop({ type: String })
    district: string;

    @Prop({ type: String })
    ward: string;

    @Prop({ type: String })
    address: string;

    @Prop({ type: String })
    phone: string;

    @Prop({ type: String })
    email: string;

    @Prop({ type: String })
    longitude: string;

    @Prop({ type: String })
    latitude: string;

    @Prop({ type: String })
    image: string;

    @Prop({ type: Boolean, default: true })
    isActive: boolean;

    @Prop({ type: Map, of: String })
    workingHours: Map<string, string>;

    @Prop({ type: SchemaTypes.ObjectId, ref: COLLECTION_NAME.USER, required: true })
    owner: Types.ObjectId;
}

export const StoreSchema = SchemaFactory.createForClass(Store);

StoreSchema.virtual('fullAddress').get(function () {
    return `${this.address}, ${this.ward}, ${this.district}, ${this.province}`;
});
StoreSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

StoreSchema.pre('updateOne', function (next) {
    generateSlugIfNeeded(this.getUpdate());
    next();
});

StoreSchema.pre('findOneAndUpdate', function (next) {
    generateSlugIfNeeded(this.getUpdate());
    next();
});



function generateSlugIfNeeded(updateOrDoc: any) {
    const name = updateOrDoc?.$set?.name || updateOrDoc?.name;
    const slug = updateOrDoc?.$set?.slug || updateOrDoc?.slug;

    if (name && !slug) {
        const generatedSlug = _.kebabCase(name);

        if (updateOrDoc.$set) {
            updateOrDoc.$set.slug = generatedSlug;
        } else {
            updateOrDoc.slug = generatedSlug;
        }
    }
}

