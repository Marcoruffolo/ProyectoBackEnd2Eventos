import { createEvent as createEventService, getEvents } from "../services/event.service.js";
import { EventDTO } from "../dto/event.dto.js";

export const createEvent = async(req, res) => {
    const event = await createEventService(req.body, req.user.id)
    res.status(201).json({ status: "success", payload : EventDTO(event)})
}

export const eventList = async(req, res) => {
    const { events, page, limit, total, totalPages } = await getEvents(req.query)
    const desiredEvents = events.map(event => EventDTO(event))
    res.status(200).json({ status: "success", data: desiredEvents, page, limit, total, totalPages })
}