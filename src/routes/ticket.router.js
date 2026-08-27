import { Router } from "express";
import { myTickets, cancelTicket } from "../controllers/ticket.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router()
router.get("/my-tickets", authenticate, myTickets)
router.patch("/:tid/cancel", authenticate, cancelTicket)
export default router
