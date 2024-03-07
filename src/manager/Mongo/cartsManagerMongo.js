import cartModel from "../../models/carts.model.js"

class CartManagerMongo {
    async getCarts(){
        return await cartModel.find({})
    }

    async getCart(cid){
        return await cartModel.findOne({_id: cid})
    }

    async createCart(newCart){
        return await cartModel.create(newCart)
    }
    
    async updateCart(cid){
        return await cartModel.findOneAndUpdate({_id: cid},  {new: true})
    }

    async deleteCart(cid){
        return await cartModel.deleteOne({_id: cid})
    }
}

export default CartManagerMongo