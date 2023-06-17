import express from 'express'
import lessonsRouter from "./modules/lessons/lessonsRouter.js";
import lessonTypesRouter from "./modules/lessonTypes/lessonTypesRouter.js";
import facultiesRouter from "./modules/faculties/facultiesRouter.js";
import roomsRouter from "./modules/rooms/roomsRouter.js";
import teachersRouter from "./modules/teachers/teachersRouter.js";
import groupsRouter from "./modules/groups/groupsRouter.js";


export const createServer = () => {

    const app = express();
    app.use(express.json());

    app.use("", lessonsRouter);
    app.use("", lessonTypesRouter);
    app.use("", facultiesRouter);
    app.use("", roomsRouter);
    app.use("", teachersRouter);
    app.use("", groupsRouter);

    return app;

}
