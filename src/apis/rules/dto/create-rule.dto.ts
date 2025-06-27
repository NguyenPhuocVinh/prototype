import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ExcludeModel } from 'src/common/models/exclude.model';

export class CreateRuleDto extends PartialType(ExcludeModel) {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    type: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    is_active: number;
}
