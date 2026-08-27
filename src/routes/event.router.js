import { Router } from "express";
import { createEvent, eventList } from "../controllers/event.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
const router = Router()
router.post("/", authenticate, authorize(["organizer","admin"]), createEvent)
router.get("/", eventList)
export default router