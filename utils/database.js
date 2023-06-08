import mysql from "mysql2/promise";
import databaseConfig from "./databaseConfig.js";

let connection;
export const createPool = async () => await mysql.createPool(databaseConfig);

export const getConnection = async () => {

    if (!connection)
        connection = await createPool();
    return connection;

};