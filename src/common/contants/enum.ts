export enum RULE_PERMISSION {
    VIEW_ALL = 'view_all',
    VIEW_OWN = 'view_own',
}

export enum OPERATOR {
    LIKE = 'LIKE',
    NOT_LIKE = 'NOTLIKE',
    IN = 'IN',
    NOT_IN = 'NOTIN',
    BETWEEN = 'BTW',
    ISNULL = 'ISNULL',
    BEFORE = 'LT',
    IS_AND_BEFORE = 'LTEQ',
    AFTER = 'GT',
    IS_AND_AFTER = 'GTEQ',
    IS = 'IS',
    NOT = 'NOT',
    IS_EMPTY = 'ISEMPTY',
    FULL_TEXT_SEARCH = 'FULL_TEXT_SEARCH',
}

export enum SearchType {
    AND = 'and',
    OR = 'or',
}

export enum TENANT_TYPE {
    PRIVATE = 'private',
    PUBLIC = 'public',
}