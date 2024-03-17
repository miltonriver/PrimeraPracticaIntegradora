import userModel from "../../models/users.model.js"

class UserManagerMongo {
    async getUsers(){
        return await userModel.find({})
    }

    async getUsersPaginate(page = 1, limit = 5){
        const options = {
            page: page,
            limit: limit
        };
        return await userModel.paginate({}, options)
    }

    async getUser(username){
        return await userModel.findOne({username})
    }

    async createUser(newUser){
        return await userModel.create(newUser)
    }

    async updateUser(uid, userToUpdate){
        return await userModel.findByIdAndUpdate({_id: uid}, userToUpdate, {new: true})
    }
    
    async deleteUser(uid){
        return await userModel.deleteOne({_id: uid})
    }
}

export default UserManagerMongo