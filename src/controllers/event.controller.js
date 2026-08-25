import { createEvent as createEventService } from "../services/event.service.js";
import { EventDTO } from "../dto/event.dto.js";

export const createEvent = async(req, res) => {
    const event = await createEventService(req.body, req.user.id)
    res.status(201).json({ status: "success", payload : EventDTO(event)})
}