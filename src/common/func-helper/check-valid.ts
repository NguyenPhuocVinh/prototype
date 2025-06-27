import _ from 'lodash';

export const isArrayObject = (value: [object]) => {};

export const isObjectAndNotEmpty = (value: object) => {
    if (_.isEmpty(value) || !value) return false;
    return _.isObject(value) && value['_id'];
};
