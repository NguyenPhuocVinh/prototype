import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { BaseService } from 'src/cores/base-service/base.service';
import { Media } from './entities/medias.entity';
import { BaseRepositoryService } from 'src/cores/base-service/repository.service';
import { COLLECTION_NAME } from 'src/cores/__schema__/configs/enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CloudinaryService, IUploadedMulterFile } from 'src/packages/cloudinary/cloudinary.service';
import _ from 'lodash';
import { relationRootPick } from 'src/common/models/root/relation-root';
import { UPLOAD } from 'src/cores/event-handler/constants';
import { appSettings } from 'src/configs/app.config';
import { extname } from 'path';
import { mongooseTransactionHandler } from 'src/common/func-helper/mongoose-transaction';
import { CreatedBy } from 'src/common/models/root/created-by-root';
import { CreateMediaDto } from './dto/create-media.dto';

@Injectable()
export class MediasService extends BaseService<Media> {
    baseRepositoryService: BaseRepositoryService<Media>;
    collection: string = COLLECTION_NAME.MEDIA;
    constructor(
        @InjectModel(COLLECTION_NAME.MEDIA)
        private readonly fileModel: Model<Media>,
        // @InjectModel(COLLECTION_NAME.CATEGORY)
        // private readonly categoryModel: Model<Category>,
        @InjectConnection()
        public readonly connection: Connection,
        private readonly cloudinaryService: CloudinaryService,
        eventEmitter: EventEmitter2,
    ) {
        super(connection, fileModel, eventEmitter, COLLECTION_NAME.MEDIA);
        this.baseRepositoryService = new BaseRepositoryService(
            fileModel,
            COLLECTION_NAME.MEDIA,
            eventEmitter,
        );
    }

    async uploadFile(
        createMediaDto: CreateMediaDto,
        file: IUploadedMulterFile,
        createdBy: CreatedBy,
    ): Promise<any> {
        const session = await this.connection.startSession();
        const { originalname, mimetype, size } = file;
        const { alt, title, categories } = createMediaDto?.media[0];
        let categoryData = {};
        // if (_.size(categories) > 0) {
        //     categoryData = await this.categoryModel.findOne({
        //         id: categories[0],
        //         locale,
        //     });

        //     if (!categoryData) {
        //         throw new UnprocessableEntityException('Category not found');
        //     }
        // }
        const type = mimetype.split('/')[0];
        const disk = `${appSettings.cloudinary.folder}`;
        const fileNameRandom = this.generateFileName(extname(originalname));
        const fileNameWithoutExt = fileNameRandom.split('.').slice(0, -1).join('.');
        const filePath = `/${type}/${UPLOAD.TYPE}/${disk}/${fileNameRandom}`;

        this.eventEmitter.emit(UPLOAD.IMAGE, {
            file,
            fileNameRandom: fileNameWithoutExt,
        })

        const result = new this.fileModel({
            filename: fileNameRandom,
            path: filePath,
            slug: fileNameRandom,
            originalname,
            mimetype,
            size,
            alt,
            title,
            disk,
            mime: mimetype,
            categories: categoryData
                ? [_.pick(categoryData, relationRootPick)]
                : [],
            createdBy,
        })

        const transactionHandlerMethod = async () => {
            await this.baseRepositoryService.save(result, { session });
        };

        await mongooseTransactionHandler<void>(
            transactionHandlerMethod,
            (error) => {
                throw new UnprocessableEntityException(error);
            },
            this.connection,
            session,
        );

        return {
            data: {
                ...result['_doc'],
                path: `${appSettings.cloudinary.url}${result.path}`,
            },
        };
    }

    private generateFileName(fileType: string) {
        const result =
            Array(32)
                .fill(null)
                .map(() => Math.round(Math.random() * 16).toString(16))
                .join('')
            + fileType;

        return result;
    }
}
