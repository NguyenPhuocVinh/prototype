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
    collection: COLLECTION_NAME.DRIVER,
})
export class Driver extends Document {
    @Property({ type: String.name })
    @Prop({ type: String, required: true, unique: true })
    phone: string;

    @Property({ type: String.name })
    @Prop({ type: String, required: true, unique: true })
    email: string;

    @Property({ type: String.name })
    @Prop({ type: String, required: true })
    password: string;

    @Property({ type: String.name })
    @Prop({ type: String, required: true })
    firstName: string;

    @Property({ type: String.name })
    @Prop({ type: String, required: true })
    lastName: string;

    @Property({ type: Date })
    @Prop({ type: Date })
    birthDate: Date;

    @Property({ type: Boolean.name })
    @Prop({ type: Boolean, default: false })
    isVerified: boolean;

    @Property({ type: Boolean.name })
    @Prop({ type: Boolean, default: false })
    phoneVerified: boolean;

    @Property({ type: Boolean.name })
    @Prop({ type: Boolean, default: false })
    aiChecked: boolean;

    @Property({ type: [FileRoot.name], ref: COLLECTION_NAME.FILE })
    @Prop({ type: Object, ref: COLLECTION_NAME.FILE })
    avatar: FileRoot;

    @Property({ type: Types.ObjectId.name, ref: COLLECTION_NAME.DRIVER_IDENTITY })
    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAME.DRIVER_IDENTITY })
    driverIdentity: Types.ObjectId;

    @Property({ type: String.name })
    @Prop({ type: String, required: true })
    province: string;

    @Property({ type: String.name })
    @Prop({ type: String, required: true })
    district: string;

    @Property({ type: String.name })
    @Prop({ type: String, required: true })
    ward: string;

    @Property({ type: String.name })
    @Prop({ type: String, required: true })
    address: string;

    @Property({ type: Boolean.name })
    @Prop({ type: Boolean, default: true })
    isActive: boolean;

    @Property({ type: Types.ObjectId.name, ref: COLLECTION_NAME.ROLE })
    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAME.ROLE })
    role: Types.ObjectId;

    @Property({ type: [Types.ObjectId.name], ref: COLLECTION_NAME.DRIVER_REVIEW })
    @Prop({ type: [Types.ObjectId], ref: COLLECTION_NAME.DRIVER_REVIEW })
    reviews: Types.ObjectId[];

}

export const DriverSchema = SchemaFactory.createForClass(Driver);

DriverSchema.index(
    {
        fullName: 'text',
        lastName: 'text',
        firstName: 'text',
        email: 'text',
    },
    {
        weights: {
            fullName: 10,
            lastName: 5,
            firstName: 5,
            email: 1,
        },
    },
);

DriverSchema.pre('save', function (next) {
    if (this.isModified('phone')) {
        this.phone = this.phone.trim();
    }
    if (this.isModified('email')) {
        this.email = this.email.trim().toLowerCase();
    }
    if (this.isModified('firstName')) {
        this.firstName = this.firstName.trim();
    }
    if (this.isModified('lastName')) {
        this.lastName = this.lastName.trim();
    }
    next();
});

DriverSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    if (update && typeof update === 'object' && !Array.isArray(update)) {
        const set = update.$set || update;
        if (set.phone) {
            set.phone = set.phone.trim();
        }
        if (set.email) {
            set.email = set.email.trim().toLowerCase();
        }
        if (set.firstName) {
            set.firstName = set.firstName.trim();
        }
        if (set.lastName) {
            set.lastName = set.lastName.trim();
        }
        if (set.firstName || set.lastName) {
            set.fullName = `${set.lastName || ''} ${set.firstName || ''}`.trim();
        }
        if (update.$set) {
            update.$set = set;
        }
    }
    next();
});

DriverSchema.set('toJSON', {
    virtuals: true,

});

DriverSchema.set('toObject', {
    virtuals: true,
    // transform: function (doc, ret) {
    //     delete ret.id
    // }
});


DriverSchema.post('find', function (docs, next) {
    docs.forEach((doc) => {
        if (isObjectAndNotEmpty(doc?.avatar)) {
            doc['avatar']['path'] = transferValuePathImage(
                doc['avatar'],
            );
        }
    });
    next();
});

DriverSchema.post('findOne', function (doc, next) {
    if (isObjectAndNotEmpty(doc?.avatar)) {
        doc['avatar']['path'] = transferValuePathImage(doc['avatar']);
    }
    next();
});

DriverSchema.virtual('fullAddress').get(function (this: any) {
    const parts = [this.address, this.ward, this.district, this.province]
        .filter(Boolean)
        .map((s) => s.trim());
    return parts.join(', ');
});

DriverSchema.virtual('fullName').get(function (this: any) {
    const first = this.firstName?.trim() || '';
    const last = this.lastName?.trim() || '';
    return `${last} ${first}`.trim();
});

