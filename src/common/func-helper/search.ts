import { UnprocessableEntityException } from "@nestjs/common";
import _, { isObjectLike } from "lodash";
import { FilterQuery, SortOrder } from "mongoose";
import { OPERATOR, SearchType } from "../contants/enum";
import { appSettings } from "src/configs/app.config";
import { diacriticSensitiveRegex, getTimeForLocation } from "./conver-value";

export interface SortOption {
    sortBy: string;
    other: SortOrder | any;
}

export interface FullTextSearch {
    $facet: any;
    $project: any;
}

export const sortConfig = (sort: string) => {
    if (!sort) return null

    const sortArr = sort.split('-')

    let sortObject: SortOption = {
        sortBy: '',
        other: 1
    }

    if (sortArr.length > 1) {
        sortObject = {
            sortBy: sortArr[1],
            other: -1
        }
    } else {
        sortObject = {
            sortBy: sortArr[0],
            other: 1
        }
    }
    return sortObject
}

export const searchConfigSelect = (search: string) => {
    if (!search) return null
    const keys = search.split(',')
    return keys.join(' ')
}

export const searchConfig = (search: any, searchType: string = 'and') => {
    if (!isObjectLike(search)) return []

    const keys = Object.keys(search)
    const result = keys.map((key) => {
        const [searchBy, operator] = key.split(':')

        if (!operator) throw new UnprocessableEntityException('Invalid search query operator')

        if (!searchBy) throw new UnprocessableEntityException('Invalid search query search by')

        if (_.upperCase(operator) === OPERATOR.BETWEEN) {
            const [from, to] = search[key].split(',')
            return {
                searchBy,
                operator,
                keyword: {
                    from: new Date(from),
                    to: new Date(to)
                }
            }
        }

        if (
            operator.toLocaleUpperCase() === OPERATOR.IN ||
            operator.toLocaleLowerCase() === OPERATOR.NOT_IN
        ) {
            const array = search[key].split(',')
            for (let i = 0; i < array.length; i++) {

                if (Number(array[i])) array[i] = Number(array[i])

                if (_.isString(array[i])) array[i] = array[i].replace(/%3C/g, '<')
            }

            return {
                searchBy,
                operator,
                keyword: array
            }
        }
        return {
            searchBy,
            operator,
            keyword: Number(search[key]) ? Number(search[key]) : search[key],
        }
    })

    let filterQuery: FilterQuery<any> = {
        $and: [],
        $or: [],
    };

    result.forEach((item) => {
        searchQuery(
            filterQuery,
            item.operator,
            item.searchBy,
            item.keyword,
            searchType,
        );
    });

    if (filterQuery.$and.length === 0) {
        delete filterQuery.$and;
    }

    if (filterQuery.$or.length === 0) {
        delete filterQuery.$or;
    }

    return filterQuery;
}

export const searchQuery = (
    filterQuery: FilterQuery<any>,
    operator: string,
    searchBy: string,
    keyword: any,
    searchType: string
): Promise<FilterQuery<any>> => {
    operator = operator.toUpperCase()

    if (!keyword) return

    if (keyword === 'true') keyword = true
    else if (keyword === 'false') keyword = false
    else if (keyword === 'null') keyword = null

    if (searchType === SearchType.AND) {
        switch (operator) {
            case OPERATOR.LIKE:
                const regex = diacriticSensitiveRegex(String(keyword)).split(' ')
                for (let i = 0; i < regex.length; i++) {
                    if (regex[i] === '') continue
                    filterQuery['$and'].push({
                        [searchBy]: {
                            $regex: regex[i]
                                .replace(/([^\s])/g, '\\s*$1')
                                .replace(/\s/g, '\\s*'),
                            $options: 'i',
                        }
                    })
                }
                break;

            case OPERATOR.NOT_LIKE:
                filterQuery['$and'].push({
                    [searchBy]: {
                        $not: {
                            $regex: diacriticSensitiveRegex(String(keyword)),
                            $options: 'i'
                        }
                    }
                })
                break;

            case OPERATOR.IN:
                filterQuery['$and'].push({
                    [searchBy]: {
                        $in: keyword,
                    },
                });
                break;
            case OPERATOR.NOT_IN:
                filterQuery['$and'].push({
                    [searchBy]: {
                        $nin: keyword,
                    },
                });
                break;
            case OPERATOR.BETWEEN:
                const { from, to } = keyword as any;
                filterQuery['$and'].push({
                    [searchBy]: {
                        $gte: from,
                        $lte: to,
                    },
                });
                break;
            case OPERATOR.BEFORE:
                filterQuery['$and'].push({
                    [searchBy]: {
                        $lt: _.isDate(keyword)
                            ? getTimeForLocation(keyword, appSettings.timezone)
                            : parseInt(keyword),
                    },
                });
                break;
            case OPERATOR.IS_AND_BEFORE:
                filterQuery['$and'].push({
                    [searchBy]: {
                        $lte: _.isDate(keyword)
                            ? getTimeForLocation(keyword, appSettings.timezone)
                            : parseInt(keyword),
                    },
                });
                break;
            case OPERATOR.AFTER:
                filterQuery['$and'].push({
                    [searchBy]: {
                        $gt: _.isDate(keyword)
                            ? getTimeForLocation(keyword, appSettings.timezone)
                            : parseInt(keyword),
                    },
                });
                break;
            case OPERATOR.IS_AND_AFTER:
                filterQuery['$and'].push({
                    [searchBy]: {
                        $gte: _.isDate(keyword)
                            ? getTimeForLocation(keyword, appSettings.timezone)
                            : parseInt(keyword),
                    },
                });
                break;
            case OPERATOR.ISNULL:
                filterQuery['$and'].push({
                    [searchBy]: {
                        $exists: keyword,
                    },
                });
                break;
            case OPERATOR.NOT:
                filterQuery['$and'].push({
                    $or: [
                        {
                            [searchBy]: {
                                $ne: keyword,
                            },
                        },
                    ],
                });
                break;
            case OPERATOR.IS:
                filterQuery['$and'].push({
                    [searchBy]: keyword,
                });
                break;
            case OPERATOR.IS_EMPTY:
                if (keyword === true) {
                    filterQuery['$and'].push({
                        [searchBy]: {
                            $exists: true,
                            $in: [null, '', [] as any],
                        },
                    });
                } else {
                    filterQuery['$and'].push({
                        [searchBy]: {
                            $nin: [null, '', [] as any],
                        },
                    });
                }
                break;
            default:
                break;
        }
    }
    if (searchType === SearchType.OR) {
        switch (operator) {
            case OPERATOR.LIKE:
                filterQuery['$or'].push({
                    [searchBy]: {
                        $regex: diacriticSensitiveRegex(String(keyword)),
                        $options: 'i',
                    },
                });
                break;
            case OPERATOR.NOT_LIKE:
                filterQuery['$or'].push({
                    [searchBy]: {
                        $not: {
                            $regex: diacriticSensitiveRegex(String(keyword)),
                            $options: 'i',
                        },
                    },
                });
                break;
            case OPERATOR.IN:
                filterQuery['$or'].push({
                    [searchBy]: {
                        $in: keyword,
                    },
                });
                break;
            case OPERATOR.NOT_IN:
                filterQuery['$or'].push({
                    [searchBy]: {
                        $nin: keyword,
                    },
                });
                break;
            case OPERATOR.BETWEEN:
                const { from, to } = keyword as any;
                filterQuery['$or'].push({
                    [searchBy]: {
                        $gte: from,
                        $lte: to,
                    },
                });
                break;
            case OPERATOR.BEFORE:
                filterQuery['$or'].push({
                    [searchBy]: {
                        $lt: _.isDate(keyword)
                            ? getTimeForLocation(keyword, appSettings.timezone)
                            : parseInt(keyword),
                    },
                });
                break;
            case OPERATOR.IS_AND_BEFORE:
                filterQuery['$or'].push({
                    [searchBy]: {
                        $lte: _.isDate(keyword)
                            ? getTimeForLocation(keyword, appSettings.timezone)
                            : parseInt(keyword),
                    },
                });
                break;
            case OPERATOR.AFTER:
                filterQuery['$or'].push({
                    [searchBy]: {
                        $gt: _.isDate(keyword)
                            ? getTimeForLocation(keyword, appSettings.timezone)
                            : parseInt(keyword),
                    },
                });
                break;
            case OPERATOR.IS_AND_AFTER:
                filterQuery['$or'].push({
                    [searchBy]: {
                        $gte: _.isDate(keyword)
                            ? getTimeForLocation(keyword, appSettings.timezone)
                            : parseInt(keyword),
                    },
                });
                break;
            case OPERATOR.ISNULL:
                filterQuery['$or'].push({
                    [searchBy]: {
                        $exists: keyword,
                    },
                });
                break;
            case OPERATOR.NOT:
                filterQuery['$and'].push({
                    [searchBy]: {
                        $ne: keyword,
                    },
                });
                break;
            case OPERATOR.IS:
                filterQuery['$or'].push({
                    [searchBy]: keyword,
                });
                break;
            default:
                break;
        }
    }
}

export const fullTextSearchConfig = (
    search: { [key: string]: any },
    page: number,
    limit: number,
): FullTextSearch => {
    if (!search) return null;
    const searchKeys = Object.keys(search);
    const result = searchKeys.map((key) => {
        const keyword = search[key];
        const searchBy = key;
        const regex = diacriticSensitiveRegex(String(keyword)).split(' ');

        const result = [];
        for (let i = 0; i < regex.length; i++) {
            for (let j = i + 1; j <= regex.length; j++) {
                result.push(regex.slice(i, j));
            }
        }

        const countMap = {};

        for (const subArr of result) {
            const key = subArr.length;
            if (!countMap[key]) {
                countMap[key] = [];
            }
            countMap[key].push(subArr);
        }

        const keys = Object.keys(countMap);

        const facet = new Object();

        for (const key of keys) {
            const arr = countMap[key];
            const orArr = [];
            for (const subArr of arr) {
                const obj = {};
                obj[searchBy] = {
                    $regex: subArr
                        .join(' ')
                        .replace(/([^\s])/g, '\\s*$1')
                        .replace(/\s/g, '\\s*'),
                    $options: 'i',
                };
                orArr.push(obj);
            }
            facet[`priority${key}`] = [
                { $match: { $or: orArr } },
                { $addFields: { priority: parseInt(key) } },
                {
                    $limit: Number(limit),
                },
                {
                    $skip: (page - 1) * Number(limit),
                },
            ];
        }

        return {
            $facet: facet,
            $project: {
                combinedResults: {
                    $concatArrays: keys
                        .sort((a, b) => parseInt(b) - parseInt(a))
                        .map((key) => `$priority${key}`),
                },
            },
        };
    });

    return result[0];
};