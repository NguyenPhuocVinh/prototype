export const replacePlaceholders = (obj: any, payload: any): any => {
    if (typeof obj === "string") {
        const match = obj.match(/{{\s*([\w]+)\s*}}/);
        if (match) {
            const key = match[1];
            return payload[key] !== undefined ? payload[key] : obj;
        }
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map((item) => replacePlaceholders(item, payload));
    }
    if (typeof obj === "object" && obj !== null) {
        const newObj: any = {};
        for (const k in obj) {
            newObj[k] = replacePlaceholders(obj[k], payload);
        }
        return newObj;
    }
    return obj;
}