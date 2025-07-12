import { Transform } from 'class-transformer';
import { convertToObjectIds } from 'src/common/func-helper/conver-value';

export function ToObjectIdArray() {
    return Transform(({ value }) => convertToObjectIds(value));
}
