import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";

@Injectable()
export class EntitiesService {
    constructor(
        @InjectConnection() public readonly connection: Connection
    ) { }

    getModel(collectionName: string) {
        if (!collectionName) {
            throw new Error("Collection name is required ");
        }
        return this.connection.model(collectionName);
    }
}