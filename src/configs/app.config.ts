import 'dotenv/config';
export const appSettings = {
    appName: process.env.APP_NAME,
    port: process.env.PORT,
    timezone: process.env.TIME_ZONE,
    mainLanguage: process.env.MAIN_LANGUAGE,
    apiVersion: process.env.VERSION,
    languages: process.env.LANGUAGES ? process.env.LANGUAGES.split(',') : [],
    isDevelopment: process.env.DEVELOPMENT,
    appUrl: process.env.APP_URL,
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        issuer: process.env.JWT_ISSUER,
    },
    mongoose: {
        uri: process.env.MONGO_URI,
        isReplicaSet: process.env.IS_REPLICA_SET,
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
        folder: process.env.CLOUDINARY_FOLDER,
        url: process.env.CLOUDINARY_PUBLIC,
    },
    redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10),
        password: process.env.REDIS_PASSWORD,
        username: process.env.REDIS_USERNAME,
    }
}
