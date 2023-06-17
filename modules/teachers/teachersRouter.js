import {Router} from "express";
import teachersController from "./teachersController.js";


const teachersRouter = new Router();

teachersRouter.get("/teachers", teachersController.getAll);
teachersRouter.get("/teachers/:id", teachersController.getOne);
teachersRouter.post("/teachers", teachersController.create);
teachersRouter.put("/teachers/:id", teachersController.update);
teachersRouter.delete("/teachers/:id", teachersController.delete);

export default teachersRouter;