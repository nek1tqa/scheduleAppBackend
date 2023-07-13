import {Router} from "express";
import roomsScheduleController from "./roomsScheduleController.js";


const roomsScheduleRouter = new Router();


// roomsScheduleRouter.get("/rooms_schedule/:id", roomsScheduleController.getRoomsSchedule);

roomsScheduleRouter.get("/rooms_schedule/pages", roomsScheduleController.getAllPages);
roomsScheduleRouter.get("/rooms_schedule/pages/:id", roomsScheduleController.getPage);
roomsScheduleRouter.post("/rooms_schedule/pages", roomsScheduleController.createPage);
// roomsScheduleRouter.put("/rooms_schedule/pages/:id", roomsScheduleController.updatePage);
roomsScheduleRouter.delete("/rooms_schedule/pages/:id", roomsScheduleController.deletePage);

export default roomsScheduleRouter;
