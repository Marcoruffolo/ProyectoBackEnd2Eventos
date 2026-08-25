import { Router } from "express";
import { createEvent } from "../controllers/event.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
const router = Router()
router.post("/", authenticate, authorize(["organizer","admin"]), createEvent)
export default router