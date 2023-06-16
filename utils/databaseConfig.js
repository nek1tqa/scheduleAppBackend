import appConfig from "./appConfig.js";

const databaseConfig = {
    connectionLimit: 10,
    host: appConfig.databaseHost,
    user: appConfig.databaseLogin,
    password: appConfig.databasePassword,
    database: appConfig.databaseName,
    debug: false,
    waitForConnections: true,
    multipleStatements: true
};

export default databaseConfig;