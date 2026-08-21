export class UserRepository{
    constructor(dao){
        this.dao = dao
    }

    async create(data){
        return this.dao.create(data)
    }

    async getByEmail(email){
        return this.dao.getByEmail(email)
    }

    async getById(id){
        return this.dao.getById(id)
    }
}