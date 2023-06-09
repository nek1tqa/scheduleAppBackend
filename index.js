import express from 'express'
import appConfig from "./utils/appConfig.js";
import lessonsRouter from "./modules/lessons/lessonsRouter.js";


const PORT = appConfig.port;

const main = async () => {


}

main();
const app = express();
app.use(express.json());

app.use("", lessonsRouter);


app.get("/", (req, res) => {
    res.status(200).json("all is working!!!");
});

app.listen(PORT, () => console.log("SERVER START"));