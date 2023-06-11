import {Router} from "express";
import lessonTypesController from "./lessonTypesController.js";


const lessonTypesRouter = new Router();

lessonTypesRouter.get("/lesson_types", lessonTypesController.getAll);
lessonTypesRouter.get("/lesson_types/:id", lessonTypesController.getOne);
lessonTypesRouter.post("/lesson_types", lessonTypesController.create);
lessonTypesRouter.put("/lesson_types/:id", lessonTypesController.update);
lessonTypesRouter.delete("/lesson_types/:id", lessonTypesController.delete);

export default lessonTypesRouter;