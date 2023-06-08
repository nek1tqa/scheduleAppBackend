import appConfig from "./appConfig.js";

const databaseConfig = {
    connectionLimit: 10,
    host: appConfig.databaseHost,
    user: appConfig.databaseLogin,
    password: "xj7NaKRZkfAxXUnjvsL92)tV",
    database: "schedule_new",
    debug: false,
    waitForConnections: true,
    multipleStatements: true
};

export default databaseConfig;