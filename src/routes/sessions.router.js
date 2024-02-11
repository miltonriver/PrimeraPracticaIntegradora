import { Router } from "express";
import auth from "../middleware/authentication.middleware.js";
import UserManagerMongo from "../manager/Mongo/userManagerMongo.js";
import productsModel from "../models/products.model.js";

const sessionsRouter = Router()
const sessionService = new UserManagerMongo()

sessionsRouter.get('/login', (req, res) =>  {
    res.send('login success')
})

sessionsRouter.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, username, email, password, phone_number } = req.body
    
        if(!first_name || !last_name || !username || !email || !password){
            return res.send("Quedan campos sin llenar, por favor ingrese los campos que son obligatorios")
        }
    
        const newUser = {
            first_name,
            last_name,
            username,
            email,
            password,
            phone_number
        }
        const result = await sessionService.createUser(newUser)
        res.render('registerSuccess', {
            username: username,
            style: "index.css"
        })
        
    } catch (error) {
        res.send({
            status: "error",
            error: error.message
        })
    }
})

sessionsRouter.post('/login', async (req, res) =>  {
    try {
        const { username, password } = req.body
    
        
        const user = await sessionService.getUser(username)
        console.log("mostrar el contenido de user", user)
        if(!user) {
            return res.send({
                status: "error",
                error: "El usuario no existe o no está registrado"
            })
        }
        
        if(user.password !== password){
            return res.send('Login failed: Contraseña incorrecta')
        }

        req.session.user = {id: user.id, username: user.username, admin: true}
    
        // res.send('login success')
        const products = await productsModel.find({})
        res.render('productosActualizados', {
            username: username,
            productos: products,
            style: 'index.css'
        })
        
    } catch (error) {
        res.send({
            status: "error",
            error: error.message
        })
    }
})

sessionsRouter.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if(error) return res.send('Logout error')
        res.send({
            status: 'success',
            message: 'logout ok'
        })
    })
})

sessionsRouter.get('/current', auth, (req, res) => {
    res.send('<h1>Datos sensibles</h1>')
})


export default sessionsRouter