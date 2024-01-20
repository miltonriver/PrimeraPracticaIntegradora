import cartModel from "../../models/carts.model.js"

class CartManagerMongo {
    async getCarts(){
        return await cartModel.find({})
    }

    async getCart(cid){
        return await cartModel.findOne({_id: cid})
    }

    async createCarts(newCart){
        return await cartModel.create(newCart)
    }
    
    async updateCart(cid){
        return await cartModel.updateOne({_id: cid})
    }

    async deleteCart(cid){
        return await cartModel.deleteOne({_id: cid})
    }
}