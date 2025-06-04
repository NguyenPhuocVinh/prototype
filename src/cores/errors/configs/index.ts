export const MultipleLanguageSystemErrorMessages = (
    codeError: string | number,
) => {
    switch (codeError) {
        case 401:
            return {
                en: 'Unauthorized',
                vi: 'Không có quyền',
            };
        case 403:
            return {
                en: 'Forbidden',
                vi: 'Không được phép',
            };
        default:
            return {
                en: 'System Error',
                vi: 'Hệ thống có lỗi',
            };
    }
};

export const MultipleLanguageMongoErrorMessages = (
    codeError: string | number,
) => {
    switch (codeError) {
        case 11000:
        case 11001:
            return {
                en: 'Duplicate key error. Please check again!',
                vi: 'Không được trùng khóa. Vui lòng kiểm tra lại!',
            };
        case 13:
            return {
                en: 'Permission denied',
                vi: 'Không có quyền',
            };
        case 14:
            return {
                en: 'Type Mismatch',
                vi: 'Sai kiểu dữ liệu',
            };
        case 17:
            return {
                en: 'Missing Authentication Token',
                vi: 'Thiếu token',
            };
        case 18:
            return {
                en: 'Unrecoverable Index Failure On Id',
                vi: 'Lỗi không thể phục hồi được',
            };
        case 20:
            return {
                en: 'Program 20 is already running',
                vi: 'Chương trình 20 đang chạy',
            };
        case 29:
            return {
                en: 'BSON Object Too Large',
                vi: 'Đối tượng BSON quá lớn',
            };
        case 50:
            return {
                en: 'Exceeded Time Limit',
                vi: 'Vượt quá giới hạn thời gian',
            };
        case 52:
            return {
                en: 'No Chunk Delete Is Allowed',
                vi: 'Không được phép xóa',
            };
        case 59:
            return {
                en: 'Exceeded Memory Limit',
                vi: 'Vượt quá giới hạn bộ nhớ',
            };
        case 64:
            return {
                en: 'Write Concern Failed',
                vi: 'Ghi thất bại',
            };
        case 65:
            return {
                en: 'NotMaster',
                vi: 'Không phải master',
            };
        case 66:
            return {
                en: 'Too Many Locks',
                vi: 'Quá nhiều khóa',
            };
        case 67:
            return {
                en: 'Schema Diff During Migration',
                vi: 'Khác nhau cấu trúc trong quá trình di chuyển',
            };
        case 68:
            return {
                en: 'Failed To Parse',
                vi: 'Không thể phân tích',
            };
        default:
            return {
                en: 'System Error',
                vi: 'Lỗi Hệ thống',
            };
    }
};
