import express from "express";
import logger from "morgan";
import appRouter from "./routes/index.js";
import connectDB from "./config/connectDB.js"
import handlebars from "express-handlebars";
import __dirname, { uploader } from "./utils.js";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.router.js"

const app = express()
const PORT = 8080

connectDB()
app.use(express.static(__dirname+'/public'));
app.use(express.json());
app.use/express.urlencoded({ extends: true});
app.use(logger('dev'));

app.engine('handlebars', handlebars.engine())
app.set("views", __dirname+ "/views")
app.set("view engine", "handlebars")
app.use('/', viewsRouter)

app.post("/file", uploader.single('myFile'), (req, res)=> {
    res.send("imagen subida")
})

app.use(appRouter)

// app.get('/', (req, res) => {
//     res.send("Hello world")
// })

const httpServer = app.listen(PORT, (err) => {
    if(err) console.log(err)
    console.log(`Escuchando en el puerto ${PORT}`)
})

const io = new Server(httpServer)

let mensajes = []

io.on('connection', socket => {
    console.log("El cliente está conectado")

    socket.on("message1", (data) => {
        console.log(data)
    })

    socket.on('message', data => {
        console.log(data)
        mensajes.push(data)
        io.emit('messageLogs', mensajes)
    })
})