import { EventDAO } from "../dao/event.dao.js";
import { EventRepository } from "../repositories/event.repository.js";
import { AppError } from "../utils/AppError.js";

const eventRepository = new EventRepository(new EventDAO())

export const createEvent = async(eventData, organizerId) => {
    if(new Date(eventData.date) < new Date()){
        throw new AppError("no se puede crear un evento con fecha pasada",400)
    }

    if(eventData.capacity <= 0){
        throw new AppError("error de capacidad inválida",400)
    }
    if(eventData.price < 0){
        throw new AppError("error de precio inválido",400)
    }

    const event = await eventRepository.create({...eventData, organizer : organizerId})

    return event
}