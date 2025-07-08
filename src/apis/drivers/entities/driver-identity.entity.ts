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
    collection: COLLECTION_NAME.DRIVER_IDENTITY,
})
export class DriverIdentity extends Document {
    @Property({ type: String.name })
    @Prop({ type: String, required: true, unique: true })
    idNumber: string;

    @Property({ type: Date })
    @Prop({ type: Date })
    idIssueDate: Date;

    @Property({ type: FileRoot.name, ref: COLLECTION_NAME.FILE })
    @Prop({ type: Object })
    idImgFront: FileRoot;

    @Property({ type: FileRoot.name, ref: COLLECTION_NAME.FILE })
    @Prop({ type: Object })
    idImgBack: FileRoot;

    @Property({ type: FileRoot.name, ref: COLLECTION_NAME.FILE })
    @Prop({ type: Object })
    licenseImgFront: FileRoot;

    @Property({ type: FileRoot.name, ref: COLLECTION_NAME.FILE })
    @Prop({ type: Object })
    licenseImgBack: FileRoot;

    @Property({ type: Date })
    @Prop({ type: Date })
    licenseIssueDate: Date

    @Property({ type: Date })
    @Prop({ type: Date })
    regIssueDate: Date;

    @Property({ type: String.name })
    @Prop({ type: String, required: true })
    plateNumber: string;

    @Property({ type: FileRoot.name, ref: COLLECTION_NAME.FILE })
    @Prop({ type: Object })
    regImgFront: FileRoot;

    @Property({ type: FileRoot.name, ref: COLLECTION_NAME.FILE })
    @Prop({ type: Object })
    regImgBack: FileRoot;

    @Property({ type: Types.ObjectId.name, ref: COLLECTION_NAME.USER })
    @Prop({ type: Types.ObjectId })
    verifyBy: Types.ObjectId;

    @Property({ type: Types.ObjectId.name, ref: COLLECTION_NAME.DRIVER })
    @Prop({ type: Types.ObjectId })
    driver: Types.ObjectId;
}
export const DriverIdentitySchema = SchemaFactory.createForClass(DriverIdentity);

DriverIdentitySchema.pre('save', function (next) {
    if (this.isModified('idNumber')) {
        this.idNumber = this.idNumber.trim();
    }
    if (this.isModified('plateNumber')) {
        this.plateNumber = this.plateNumber.trim();
    }
    next();
})

DriverIdentitySchema.post('find', function (docs, next) {
    docs.forEach((doc) => {
        if (isObjectAndNotEmpty(doc?.idImgFront)) {
            doc['idImgFront']['path'] = transferValuePathImage(
                doc['idImgFront'],
            );
        }

        if (isObjectAndNotEmpty(doc?.idImgBack)) {
            doc['idImgBack']['path'] = transferValuePathImage(doc['idImgBack']);
        }

        if (isObjectAndNotEmpty(doc?.licenseImgFront)) {
            doc['licenseImgFront']['path'] = transferValuePathImage(
                doc['licenseImgFront'],
            );
        }

        if (isObjectAndNotEmpty(doc?.licenseImgBack)) {
            doc['licenseImgBack']['path'] = transferValuePathImage(
                doc['licenseImgBack'],
            );
        }

        if (isObjectAndNotEmpty(doc?.regImgFront)) {
            doc['regImgFront']['path'] = transferValuePathImage(
                doc['regImgFront'],
            );
        }

        if (isObjectAndNotEmpty(doc?.regImgBack)) {
            doc['regImgBack']['path'] = transferValuePathImage(
                doc['regImgBack'],
            );
        }
    });
    next();
});

DriverIdentitySchema.post('findOne', function (doc, next) {
    if (isObjectAndNotEmpty(doc?.idImgFront)) {
        doc['idImgFront']['path'] = transferValuePathImage(doc['idImgFront']);
    }

    if (isObjectAndNotEmpty(doc?.idImgBack)) {
        doc['idImgBack']['path'] = transferValuePathImage(doc['idImgBack']);
    }

    if (isObjectAndNotEmpty(doc?.licenseImgFront)) {
        doc['licenseImgFront']['path'] = transferValuePathImage(
            doc['licenseImgFront'],
        );
    }

    if (isObjectAndNotEmpty(doc?.licenseImgBack)) {
        doc['licenseImgBack']['path'] = transferValuePathImage(
            doc['licenseImgBack'],
        );
    }

    if (isObjectAndNotEmpty(doc?.regImgFront)) {
        doc['regImgFront']['path'] = transferValuePathImage(doc['regImgFront']);
    }

    if (isObjectAndNotEmpty(doc?.regImgBack)) {
        doc['regImgBack']['path'] = transferValuePathImage(doc['regImgBack']);
    }
    next();
});