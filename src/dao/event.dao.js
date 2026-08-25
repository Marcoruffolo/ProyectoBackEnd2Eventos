import EventModel from "../models/Event.js";

export class EventDAO{
    async create(data){
        return EventModel.create(data)
    }

    async getById(id){
        return EventModel.findById(id)
    }

    async updateById(id, data){
        return EventModel.findByIdAndUpdate(id, data, {new: true})
    }
}