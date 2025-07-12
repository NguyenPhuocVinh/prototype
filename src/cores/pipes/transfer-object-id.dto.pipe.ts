import { Transform } from 'class-transformer';
import { convertToObjectId } from 'src/common/func-helper/conver-value';

export function ToObjectId() {
    return Transform(({ value }) => convertToObjectId(value));
}
