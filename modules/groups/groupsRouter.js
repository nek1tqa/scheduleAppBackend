import {Router} from "express";
import groupsController from "./groupsController.js";


const groupsRouter = new Router();

groupsRouter.get("/groups", groupsController.getAll);
groupsRouter.get("/groups/:id", groupsController.getOne);
groupsRouter.post("/groups", groupsController.create);
groupsRouter.put("/groups/:id", groupsController.update);
groupsRouter.delete("/groups/:id", groupsController.delete);

export default groupsRouter;