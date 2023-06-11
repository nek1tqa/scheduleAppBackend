import mysql from "mysql2";
import databaseConfig from "./databaseConfig.js";

let pool = mysql.createPool(databaseConfig);
pool = pool.promise();

export default pool;