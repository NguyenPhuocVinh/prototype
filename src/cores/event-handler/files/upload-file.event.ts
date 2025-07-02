import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { CloudinaryService, IUploadedMulterFile } from "src/packages/cloudinary/cloudinary.service";
import { UPLOAD } from "../constants";
export interface UploadImageModel {
    file: IUploadedMulterFile;
    fileNameRandom: string;
}
@Injectable()
export class UploadFileEvent {
    private readonly logger = new Logger(UploadFileEvent.name);
    constructor(
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    @OnEvent(UPLOAD.IMAGE)
    async handleUploadImageEvent(event: UploadImageModel) {
        const { file, fileNameRandom } = event;
        const start = Date.now();
        try {
            const url = await this.cloudinaryService.uploadFile(file, fileNameRandom);
            const end = Date.now();
            // this.logger.log(`Image uploaded successfully in ${end - start}ms`, url);
        } catch (error) {
            this.logger.error("Error uploading image", error);
        }
    }

}