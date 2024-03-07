import express from "express";
import logger from "morgan";
import appRouter from "./routes/index.js";
import connectDB from "./config/connectDB.js"
import handlebars from "express-handlebars";
import __dirname, { uploader } from "./utils.js";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.router.js"
import productsModel from "./models/products.model.js";
import messagesModel from "./models/messages.model.js";
import session from "express-session";
// import FileStore  from "session-file-store";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.config.js";

const app = express()
const PORT = 8080

const hbs = handlebars.create({
    helpers: {
        increment:function (value) {
            return value + 1;
        }
    }
})

// const fileStore = FileStore(session)

connectDB()
app.use(express.static(__dirname+'/public'));
app.use(express.json());
app.use(express.urlencoded({ extends: true}));
app.use(logger('dev'));
/* app.use(session({
    // store: new fileStore({
    //     path: './sessions',
    //     ttl: 100,
    //     retries: 0
    // }), --> Para configurar la estrategia aplicando fileStore
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://miltonriver66:ysNah4318GtwLf68@cluster0.ses5lly.mongodb.net/ecommerce?retryWrites=true&w=majority",
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 30
    }),
    secret: "secretMilton",
    resave: false,
    saveUninitialized: false
}))

initializePassport();
app.use(passport.initialize());
app.use(passport.session()); */

// app.use((req, res, next) => {
//     console.log("Datos del cuerpo:", req.body);
//     next();
// });

app.engine('handlebars', hbs.engine)
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

    socket.on("addProduct",  async (productData) => {
        // console.log("Este es el contenido de l lista de productos:", productData)
        const newProduct = await productsModel.create(productData)
        const productList = await productsModel.find()
        io.emit('productsList', productList)
    })

    socket.on("deleteProduct", async (productId) => {
        const productDeleted = await productsModel.findOneAndDelete(productId)
        // console.log("este es el producto a borrar: ", productDeleted)
        const productList = await productsModel.find()
        io.emit('productsList', productList)
    })

    socket.on("addProductToCart", async (product) => {
        io.emit("updatedCart", product)
    })

    socket.on("message1", (data) => {
        console.log(data)
    })

    socket.on('message', async (data) => {
        // console.log("Esto contiene la data: ", data)
        mensajes.push(data)
        io.emit('messageLogs', mensajes)
        // console.log("Este es el contenido del array mensajes: ", mensajes)
        const { email, message } = await data

        const updatedMessages = await messagesModel.findOne({user: email})
        // console.log("Este es updatedMessages", updatedMessages)
        if (!updatedMessages){
            const newUserMessages = await messagesModel.create({user: email, message})
            console.log("Nuevo usuario creado:", newUserMessages.user)
            return
        }
        let newMessage;
        try {
            newMessage = JSON.parse(updatedMessages.message);
        } catch (error) {
            newMessage = updatedMessages.message;
        }
        // console.log("Contenido de newMessage: ", newMessage)

        updatedMessages.message = message + "\n" + newMessage
        console.log("Esto contiene updatedMessages: ", updatedMessages)

        const result = await updatedMessages.save()

    })
})