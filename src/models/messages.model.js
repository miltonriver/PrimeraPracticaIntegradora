import { Schema, model } from "mongoose";

const messagesCollection = 'users'

const messageSchema = new Schema({
    user:{
        type: String,
        unique: true,
        required: true
    },
    message: String
})

export default model(messagesCollection, messageSchema);