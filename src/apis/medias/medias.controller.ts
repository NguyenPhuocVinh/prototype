import { Body, Controller, Param, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { MediasService } from './medias.service';
import { Authorize } from 'src/cores/decorators/authorize.decorator';
import { CreateMediaDto } from './dto/create-media.dto';
import { IUploadedMulterFile } from 'src/packages/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateMediaDtoPipe } from 'src/cores/pipes/create-media.dto.pipe';

@Controller('medias')
export class MediasController {
    constructor(
        private readonly mediasService: MediasService,
    ) { }

    @Post('upload')
    @Authorize()
    @UseInterceptors(
        FileInterceptor('media[0][file]', {
            limits: {
                fileSize: 100 * 1024 * 1024,
            },
        })
    )
    async uploadFile(
        @Body(new CreateMediaDtoPipe()) createMediaDto: CreateMediaDto,
        @UploadedFile() file: IUploadedMulterFile,
        @Req() req: any,
    ): Promise<any> {
        const { user } = req;
        const data = await this.mediasService.uploadFile(
            createMediaDto,
            file,
            user
        )
        return data
    }
}
