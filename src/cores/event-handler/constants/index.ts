export enum UPDATE_RELATION_EVENT_TITLE {
    UPDATE_RELATIONS_ALL = 'update-relation.*',
    UPDATE_RELATION_MEDIA = 'update-relation.media',
    UPDATE_RELATION_USER = 'update-relation.user',
}

export enum MULTIPLE_LANGUAGES_EVENT_TITLE {
    UPDATE_DOCUMENT = 'update-document',
}

export enum DELETE_RELATION_EVENT_TITLE {
    DELETE_RELATIONS_ALL = 'delete-relation.*',
    DELETE_RELATION_MEDIA = 'delete-relation.media',
}

export enum AUDIT_EVENT {
    GET = 'GET',
    CREATED = 'CREATED',
    UPDATED = 'UPDATED',
    DELETED = 'DELETED',
    UPLOAD_FILE_FRONT = 'UPLOAD_FILE_FRONT',
}

export enum UPLOAD {
    IMAGE = 'upload-image',
    BASE64_IMAGE = 'upload-base64-image',
    TYPE = 'upload'
}


export enum EMBEDDED_TYPE {
    ONE_TO_ONE = 'one_to_one',
    ONE_TO_MANY = 'one_to_many',
    ONE_TO_MANY_PROPERTY = 'one_to_many_property',
    ONE_TO_ONE_PROPERTY = 'one_to_one_property',
}

export enum QUEUE_TITLE {
    UPDATE_RELATION_REFERENCE_ONE_TO_ONE = 'update-relation-reference-one-to-one',
    UPDATE_RELATION_REFERENCE_ONE_TO_MANY = 'update-relation-reference-one-to-many',
    UPDATE_RELATION_REFERENCE_ONE_TO_MANY_PROPERTY = 'update-relation-reference-one-to-many-property',
    UPDATE_RELATION_EMBEDDED_FILE = 'update-relation-embedded-file',
    UPDATE_RELATION_EMBEDDED_GROUP_FIELD = 'update-relation-embedded-group-field',
    UPDATE_RELATION_EMBEDDED_USER = 'update-relation-embedded-user',
    DELETE_RELATION_EMBEDDED_ONE_TO_ONE = 'delete-relation-embedded-one-to-one',
    DELETE_RELATION_EMBEDDED_ONE_TO_MANY = 'delete-relation-embedded-one-to-many',
    DELETE_RELATION_EMBEDDED_ONE_TO_MANY_PROPERTY = 'delete-relation-embedded-one-to-many-property',
    DELETE_RELATION_EMBEDDED_FILE = 'delete-relation-embedded-file',
    DELETE_RELATION_EMBEDDED_GROUP_FIELD = 'delete-relation-embedded-group-field',
    AUTO_ADD_COLLECTIONS_FOR_CONDITION = 'auto-add-collections-for-condition',
}


export enum QUEUE_PROCESSOR_TITLE {
    UPDATE_RELATION_EMBEDDED = 'update-relation-embedded',
    DELETE_RELATION_EMBEDDED = 'delete-relation-embedded',
    AUTO_ADD_COLLECTIONS_FOR_CONDITION = 'auto-add-collections-for-condition',
}

export enum HTTP_METHOD {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    PATCH = 'patch',
    DELETE = 'delete',
}

export enum API_TYPE {
    GET = 'get',
    GET_LIST = 'get-list',
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
}