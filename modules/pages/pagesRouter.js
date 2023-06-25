import {Router} from "express";
import pagesController from "./pagesController.js";


const pagesRouter = new Router();

pagesRouter.get("/pages/", pagesController.getAll);
pagesRouter.get("/pages/byFacultyId/:id", pagesController.getByFacultyId);
pagesRouter.get("/pages/:id", pagesController.getOne);
pagesRouter.post("/pages", pagesController.create);
pagesRouter.put("/pages/:id", pagesController.update);
pagesRouter.delete("/pages/:id", pagesController.delete);

export default pagesRouter;