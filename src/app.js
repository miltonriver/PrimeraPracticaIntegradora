import express from "express";
import logger from "morgan";
import appRouter from "./routes/index.js";
import connectDB from "./config/connectDB.js"
import handlebars from "express-handlebars";
import __dirname, { uploader } from "./utils.js";
// import usersRouter from "./routes/users.router.js";

const app = express()
const PORT = 8080

connectDB()
app.use(express.static(__dirname+'/public'));
app.use(express.json());
app.use/express.urlencoded({ extends: true});
app.use(logger('dev'));

app.engine('handlebars', handlebars.engine())
app.set("views", __dirname+ "/views")
//console.log(__dirname+ "/views")
app.set("view engine", "handlebars")

app.post("/file", uploader.single('myFile'), (req, res)=> {
    res.send("imagen subida")
})

app.use(appRouter)
// app.use(usersRouter)

// app.get('/', (req, res) => {
//     res.send("Hello world")
// })

app.listen(PORT, (err) => {
    if(err) console.log(err)
    console.log(`Escuchando en el puerto ${PORT}`)
})

//const io