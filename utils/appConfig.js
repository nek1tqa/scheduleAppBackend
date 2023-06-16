import dotenv from "dotenv/config";

const appConfig = {
    port: process.env.PORT,
    databaseHost: process.env.DATABASE_HOST,
    databaseLogin: process.env.DATABASE_LOGIN,
    databasePassword: process.env.DATABASE_PASSWORD,
    databaseName: process.env.DATABASE_NAME,
}

export default appConfig;