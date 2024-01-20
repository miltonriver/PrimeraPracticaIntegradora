import { Schema, model } from "mongoose";

const cartsCollection = 'carts'

const cartSchema = new Schema({
    products: {
        type: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: 'products'
            },
            quantity: {
                type: Number,
                default: 1
            }
        }]
    }   
})

export default model(cartsCollection, cartSchema);