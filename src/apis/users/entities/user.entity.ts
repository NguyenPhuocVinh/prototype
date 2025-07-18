import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import moment from 'moment-timezone';
import { Document, Types } from "mongoose";
import { COLLECTION_NAME } from "src/cores/__schema__/configs/enum";
import { cleanAccents, rawString } from "src/common/func-helper/string";
import { AggregateRootMixin } from "src/common/models/root/aggregate-root";
import { RelationRoot } from "src/common/models/root/relation-root";
import { appSettings } from "src/configs/app.config";
import { Property } from "src/cores/decorators/property.decorator";


@Schema(
    {
        timestamps: {
            currentTime: () => moment().tz(appSettings.timezone).toDate(),
        },
        collection: COLLECTION_NAME.USER
    }
)
export class User extends Document {
    @Property({ type: String.name })
    @Prop({ type: String, unique: true })
    userName: string;

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

    @Property({ type: String.name })
    @Prop({ type: String })
    fullName: string;

    @Property({ type: Date.name })
    @Prop({ type: Date })
    birthDate: Date;

    @Property({ type: Types.ObjectId.name, ref: COLLECTION_NAME.ROLE })
    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAME.ROLE })
    role: Types.ObjectId;

    @Property({ type: [Types.ObjectId.name], ref: COLLECTION_NAME.TENANT })
    @Prop({ type: [Types.ObjectId], ref: COLLECTION_NAME.TENANT })
    tenants: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index(
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
            email: 3,
            ldapUser: 1,
            mbCode: 1,
        },
        name: 'UserTextIndex',
        default_language: 'none',
    },
);

UserSchema.pre('save', function (next) {
    this.fullName = rawString(this.lastName + ' ' + this.firstName);

    if (this.email) {
        this.email = this.email.toLowerCase();
    }
    next();
})