import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import moment from 'moment-timezone';
import { Types } from "mongoose";
import { COLLECTION_NAME } from "src/common/contants/enum";
import { cleanAccents, rawString } from "src/common/func-helper/string";
import { AggregateRootMixin } from "src/common/models/root/aggregate-root";
import { RelationRoot } from "src/common/models/root/relation-root";
import { appSettings } from "src/configs/app.config";


@Schema(
    {
        timestamps: {
            currentTime: () => moment().tz(appSettings.timezone).toDate(),
        },
        collection: COLLECTION_NAME.USER
    }
)
export class User extends AggregateRootMixin(Document) {
    @Prop({ type: String, required: true, unique: true })
    phone: string;

    @Prop({ type: String, required: true, unique: true })
    email: string;

    @Prop({ type: String, required: true })
    password: string;

    @Prop({ type: String, required: true })
    firstName: string;

    @Prop({ type: String, required: true })
    lastName: string;

    @Prop({ type: String })
    fullName: string;

    @Prop({ type: Date })
    birthDay: Date;

    @Prop({ type: Object })
    roles: RelationRoot[]

    @Prop({ type: [Types.ObjectId], ref: COLLECTION_NAME.TENANT })
    tenants: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index(
    {
        full_name: 'text',
        last_name: 'text',
        first_name: 'text',
        email: 'text',
    },
    {
        weights: {
            full_name: 10,
            last_name: 5,
            first_name: 5,
            email: 3,
            ldapUser: 1,
            mbCode: 1,
        },
        name: 'UserTextIndex',
        default_language: 'none',
    },
);

UserSchema.pre('save', function (next) {
    this.full_name = rawString(this.last_name + ' ' + this.first_name);

    this.name_kodau = cleanAccents(this.last_name + ' ' + this.first_name);
    if (this.email) {
        this.email = this.email.toLowerCase();
    }
    next();
})