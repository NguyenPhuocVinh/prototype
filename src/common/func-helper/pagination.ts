// import { CONSTANT } from 'src/common/constants/enum';

export const pagination = (
    data: Array<Object>,
    page: number,
    limit: number,
    total: number,
) => {
    // if (limit === CONSTANT.ALL) {
    //     limit = total;
    // }
    const meta = {
        currentPage: Number(page),
        from: Number((page - 1) * limit + 1),
        perPage: Number(limit),
        lastPage: Number(Math.ceil(total / limit)),
        to: Number(
            page !== Math.ceil(total / limit)
                ? (page - 1) * limit + data.length
                : total - (page - 1) * limit,
        ),
        total,
    };

    return meta;
};
