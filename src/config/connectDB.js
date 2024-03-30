import { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: './.env.development' })

/* const Dotenv = dotenv.config({
    path: mode === "development" ? "./.env.development" : "./.env.production"
}) */

export const configObject = {
    port:            process.env.PORT || 8000,
    mongo_url:       process.env.MONGO_URL,
    jwt_private_Key: process.env.JWT_PRIVATE_KEY,
    persistence:     process.env.PERSISTENCE,
    gmail_user:      process.env.GMAIL_USER_APP,
    gmail_password:  process.env.GMAIL_PASS_APP,
    twilio_sid:      process.env.TWILIO_ACCOUNT_SID,
    twilio_token:    process.env.TWILIO_AUTH_TOKEN,
    twilio_phone:    process.env.TWILIO_PHONE_NUMBER
}
console.log("Contenido de configObject: ", configObject.gmail_password)
console.log("Contenido de configObject: ", configObject.gmail_user)

const connectDB = async () => {
    try {
        await connect("mongodb+srv://miltonriver66:ysNah4318GtwLf68@cluster0.ses5lly.mongodb.net/ecommerce?retryWrites=true&w=majority")//Conexión remota
        //await connect("mongodb://localhost:27017/MyDataBaseMilton") --> mongodb://127.0.0.1:27017/MyDataBaseMilton--Conexión local
        console.log("base de datos conectada")
    } catch (error) {
        console.log(error)
    }
}

export default connectDB