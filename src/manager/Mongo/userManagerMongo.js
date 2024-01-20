import userModel from "../../models/user.model.js"

class UserManagerMongo {
    async getUsers(){
        return await userModel.find({})
    }

    async getUser(uid){
        return await userModel.findOne({_id: uid})
    }

    async createUsers(newUser){
        return await userModel.create(newUser)
    }

    async updateUser(uid){
        return await userModel.updateOne({_id: uid})
    }
    
    async deleteUser(uid){
        return await userModel.deleteOne({_id: uid})
    }
}