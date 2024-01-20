import { connect } from "mongoose";

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