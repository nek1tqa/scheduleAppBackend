import express from 'express'
import lessonsRouter from "./modules/lessons/lessonsRouter.js";
import lessonTypesRouter from "./modules/lessonTypes/lessonTypesRouter.js";
import facultiesRouter from "./modules/faculties/facultiesRouter.js";


export const createServer = () => {

    const app = express();
    app.use(express.json());

    app.use("", lessonsRouter);
    app.use("", lessonTypesRouter);
    app.use("", facultiesRouter);

    return app;

}
