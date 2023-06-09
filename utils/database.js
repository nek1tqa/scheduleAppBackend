import mysql from "mysql2";
import databaseConfig from "./databaseConfig.js";

let pool = mysql.createPool(databaseConfig);
pool = pool.promise();

// const f = async () => {
//
//     await pool.query("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
//
// }

export default pool;