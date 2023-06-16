import express from 'express'
import lessonsRouter from "./modules/lessons/lessonsRouter.js";
import lessonTypesRouter from "./modules/lessonTypes/lessonTypesRouter.js";
import facultiesRouter from "./modules/faculties/facultiesRouter.js";
import roomsRouter from "./modules/rooms/roomsRouter.js";


export const createServer = () => {

    const app = express();
    app.use(express.json());

    app.use("", lessonsRouter);
    app.use("", lessonTypesRouter);
    app.use("", facultiesRouter);
    app.use("", roomsRouter);

    return app;

}
