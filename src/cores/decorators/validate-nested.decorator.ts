import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
    validateSync,
} from 'class-validator';
import { plainToClass } from 'class-transformer';

export function ValidateNestedArrayObject(
    schema: new () => any,
    isArray: boolean = true,
    validationOptions?: ValidationOptions,
) {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: 'ValidateNestedArrayObject',
            target: object.constructor,
            propertyName,
            constraints: [isArray],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (!value) return true;

                    if (isArray && !Array.isArray(value)) {
                        return false;
                    }

                    if (
                        !isArray &&
                        !Array.isArray(value) &&
                        typeof value !== 'object'
                    ) {
                        return false;
                    }

                    if (isArray) {
                        for (let i = 0; i < value.length; i++) {
                            if (
                                validateSync(plainToClass(schema, value[i]))
                                    .length
                            ) {
                                return false;
                            }
                        }
                        return true;
                    } else {
                        return validateSync(plainToClass(schema, value)).length
                            ? false
                            : true;
                    }
                },
                defaultMessage(args) {
                    if (isArray && Array.isArray(args.value)) {
                        for (let i = 0; i < args.value.length; i++) {
                            return (
                                `${args.property}::index${i} -> ` +
                                validateSync(
                                    plainToClass(schema, args.value[i]),
                                )
                                    .map((e) => Object.values(e.constraints))
                                    .reduce((acc, next) => acc.concat(next), [])
                                    .join(', ')
                            );
                        }
                    } else if (!isArray && typeof args.value === 'object') {
                        return (
                            `${args.property}: ` +
                            validateSync(plainToClass(schema, args.value))
                                .map((e) => Object.values(e.constraints))
                                .reduce((acc, next) => acc.concat(next), [])
                                .join(', ')
                        );
                    } else {
                        return `${args.property} must be ${
                            isArray ? 'an array' : 'an object'
                        } of ${schema.name} objects.`;
                    }
                },
            },
        });
    };
}
