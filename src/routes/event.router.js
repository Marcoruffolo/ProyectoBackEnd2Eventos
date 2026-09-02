import { Router } from "express";
import { createEvent, eventList, getEvent, updateEvent, updateEventStatus } from "../controllers/event.controller.js";
import { createTicket, eventTickets } from "../controllers/ticket.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

const router = Router()
router.post("/", authenticate, authorize(["organizer","admin"]), createEvent)
router.get("/", eventList)
router.get("/:id",getEvent)
router.put("/:id",authenticate, authorize(["organizer","admin"]), updateEvent)
router.patch("/:id/status", authenticate, authorize(["organizer","admin"]), updateEventStatus)
router.post("/:eid/tickets", authenticate, createTicket)
router.get("/:eid/tickets", authenticate, eventTickets)
export default router