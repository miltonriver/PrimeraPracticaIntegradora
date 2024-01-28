import { Schema, model } from "mongoose";

const productsCollection = 'products'

const productSchema = new Schema({
    title:{
        type: String,
        unique: true,
        required: true,
        index: true
    },
    description: {
        type: String,
        default: "no hay descripción del producto"
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        default: "none"
    },
    code: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    stock: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    category: {
        type: String,
        default: "comestibles"
    }
})

export default model(productsCollection, productSchema);