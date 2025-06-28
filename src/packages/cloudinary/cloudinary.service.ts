import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { appSettings } from 'src/configs/app.config';
import { Readable } from 'stream';
const { cloudinary: cloudinaryConfig } = appSettings

export interface IUploadedMulterFile {
    fieldName: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}


@Injectable()
export class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: cloudinaryConfig.cloudName,
            api_key: cloudinaryConfig.apiKey,
            api_secret: cloudinaryConfig.apiSecret,
        });
    }

    async uploadFile(file: IUploadedMulterFile, filename: string): Promise<string> {
        const { buffer } = file;
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: cloudinaryConfig.folder,
                    public_id: filename,
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result.secure_url);
                },
            );

            const readable = new Readable();
            readable.push(buffer);
            readable.push(null);
            readable.pipe(stream);
        });
    }

    async deleteFile(publicId: string): Promise<void> {
        await cloudinary.uploader.destroy(publicId);
    }
}
