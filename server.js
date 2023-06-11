import express from 'express'
import appConfig from "./utils/appConfig.js";
import lessonsRouter from "./modules/lessons/lessonsRouter.js";
import lessonTypesRouter from "./modules/lessonTypes/lessonTypesRouter.js";


export const createServer = () => {

    const app = express();
    app.use(express.json());

    app.use("", lessonsRouter);
    app.use("", lessonTypesRouter);

    return app;

}
