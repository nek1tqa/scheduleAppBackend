import express from 'express'
import {getConnection} from "./utils/database.js";
import appConfig from "./utils/appConfig.js";


const PORT = appConfig.port;

const main = async () => {

    const connection = await getConnection();
    const [rows] = await connection.query("SELECT * FROM `lesson_types`");
    // connection.
    console.log(rows);
    connection.end();

}

main();
// const app = express();
// app.use(express.json());
//
//
// app.get("/", (req, res) => {
//     res.status(200).json("all is working!!!");
// });
//
// app.listen(PORT, () => console.log("SERVER START"));