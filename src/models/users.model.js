import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const usersCollection = 'users'

const userSchema = new Schema({
    first_name: String,
    last_name: String,
    email:{
        type: String,
        unique: true,
        required: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    phone_number: Number
})
userSchema.plugin(mongoosePaginate)

export default model(usersCollection, userSchema);