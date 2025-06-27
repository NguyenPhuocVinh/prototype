import { Prop, Schema } from "@nestjs/mongoose";
import { CreatedByRoot } from "./created-by-root";
import { appSettings } from "src/configs/app.config";
import { COLLECTION_NAME } from "src/cores/__schema__/configs/enum";
import { Property } from "src/cores/decorators/property.decorator";
import { Types } from "mongoose";

export const AggregateRootMixin = <T extends new (...args: any[]) => any>(
    Base: T,
) => {
    @Schema()
    abstract class AggregateRoot extends Base {

        @Property({ type: String.name })
        @Prop()
        slug: string;

        @Property({ type: Boolean.name })
        @Prop({ default: true })
        isActive: number;

        @Property({ type: Boolean.name })
        @Prop({ type: Boolean, default: false })
        isDeleted: boolean;

        @Property({ type: CreatedByRoot.name, ref: COLLECTION_NAME.USER })
        @Prop({ type: Object, default: {} })
        createdBy: CreatedByRoot;

        @Property({ type: CreatedByRoot.name, ref: COLLECTION_NAME.USER })
        @Prop({ type: Object, default: {} })
        updatedBy: CreatedByRoot;

        @Property({ type: CreatedByRoot.name, ref: COLLECTION_NAME.USER })
        @Prop({ type: Object, default: {} })
        deletedBy: CreatedByRoot;

        @Property({ type: Date })
        @Prop({ type: Date, default: null })
        deletedAt: Date | null;
    }
    return AggregateRoot as typeof AggregateRoot & T;
}