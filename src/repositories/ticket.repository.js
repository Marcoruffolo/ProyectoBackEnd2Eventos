export class TicketRepository{
    constructor(dao){
        this.dao = dao
    }

    async create(data){
        return this.dao.create(data)
    }

    async getById(id){
        return this.dao.getById(id)
    }

    async updateById(id, data){
        return this.dao.updateById(id, data)
    }

    async findActiveByUserAndEvent(userId, eventId){
        return this.dao.findActiveByUserAndEvent(userId, eventId)
    }

    async findActiveByEvent(eventId){
        return this.dao.findActiveByEvent(eventId)
    }

    async findByUser(userId){
        return this.dao.findByUser(userId)
    }

    async findByEvent(eventId){
        return this.dao.findByEvent(eventId)
    }
}
