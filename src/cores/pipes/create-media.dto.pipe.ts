import {
    ArgumentMetadata,
    Injectable,
    PipeTransform,
    UnprocessableEntityException,
} from '@nestjs/common';
import { CreateMediaDto } from 'src/apis/medias/dto/create-media.dto';

@Injectable()
export class CreateMediaDtoPipe implements PipeTransform {
    transform(
        value: CreateMediaDto,
        metadata: ArgumentMetadata,
    ): CreateMediaDto {
        console.log("🚀 ~ CreateMediaDtoPipe ~ value:", value)
        const { media } = value;
        media?.map((item, index) => {
            const { title, alt } = item;

            if (!title) {
                throw new UnprocessableEntityException(
                    `title[${index}] is required]`,
                );
            }

            if (!alt) {
                throw new UnprocessableEntityException(
                    `alt[${index}] is required]`,
                );
            }
        });

        return value;
    }
}
