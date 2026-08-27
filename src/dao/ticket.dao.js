import TicketModel from "../models/Ticket.js";

export class TicketDAO{
    async create(data){
        return TicketModel.create(data)
    }

    async getById(id){
        return TicketModel.findById(id)
    }

    async updateById(id, data){
        return TicketModel.findByIdAndUpdate(id, data, {new: true})
    }

    async findActiveByUserAndEvent(userId, eventId){
        return TicketModel.findOne({ user: userId, event: eventId, status: "active" })
    }

    async findActiveByEvent(eventId){
        return TicketModel.find({ event: eventId, status: "active" })
    }

    async findByUser(userId){
        return TicketModel.find({ user: userId }).populate("event", "title date location status")
    }

    async findByEvent(eventId){
        return TicketModel.find({ event: eventId })
    }
}
