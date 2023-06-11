import {Router} from "express";
import lessonsController from "./lessonsController.js";


const lessonsRouter = new Router();

lessonsRouter.get("/lessons", lessonsController.getAll);
lessonsRouter.get("/lessons/:id", lessonsController.getOne);
lessonsRouter.post("/lessons", lessonsController.create);
lessonsRouter.put("/lessons/:id", lessonsController.update);
lessonsRouter.delete("/lessons/:id", lessonsController.delete);

export default lessonsRouter;