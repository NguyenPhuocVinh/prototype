import 'dotenv/config';
export const appSettings = {
    appName: process.env.APP_NAME,
    port: process.env.PORT,
    timezone: process.env.TIME_ZONE,
    mainLanguage: process.env.MAIN_LANGUAGE,
    apiVersion: process.env.VERSION,
    languages: process.env.LANGUAGES ? process.env.LANGUAGES.split(',') : [],
    isDevelopment: process.env.DEVELOPMENT,
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        issuer: process.env.JWT_ISSUER,
    },
    mongoose: {
        uri: process.env.MONGO_URI,
        isReplicaSet: process.env.IS_REPLICA_SET,
    }
}
