import {Router} from "express";
import facultiesController from "./facultiesController.js";


const facultiesRouter = new Router();

facultiesRouter.get("/faculties", facultiesController.getAll);
facultiesRouter.get("/faculties/:id", facultiesController.getOne);
facultiesRouter.post("/faculties", facultiesController.create);
facultiesRouter.put("/faculties/:id", facultiesController.update);
facultiesRouter.delete("/faculties/:id", facultiesController.delete);

export default facultiesRouter;