import { Router } from "express";
import { createEvent, eventList, getEvent, updateEvent, updateEventStatus } from "../controllers/event.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

const router = Router()
router.post("/", authenticate, authorize(["organizer","admin"]), createEvent)
router.get("/", eventList)
router.get("/:id",getEvent)
router.put("/:id",authenticate, updateEvent)
router.patch("/:id/status", authenticate, updateEventStatus)
export default router