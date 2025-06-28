import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ExcludeModel } from 'src/common/models/exclude.model';

class Media {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    alt: string;

    @ApiProperty()
    categories: string[];
}

export class CreateMediaDto extends PartialType(ExcludeModel) {
    @ApiProperty({
        type: [Media],
    })
    media: Media[];
}
