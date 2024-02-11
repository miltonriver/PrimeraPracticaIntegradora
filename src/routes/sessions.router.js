import { Router } from "express";
import auth from "../middleware/authentication.middleware.js";
import UserManagerMongo from "../manager/Mongo/userManagerMongo.js";

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
        res.send({
            status: "success",
            message: 'registro exitoso',
            payload: newUser
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
    
        // if(username !== 'milton' || password !== '12345'){
        //     return res.send('login failed')
        // }
    
        const user = await sessionService.getUser({username})
        console.log("mostrar el contenido de user", user)
        if(!user) {
            return res.send({
                status: "error",
                error: "El usuario no existe o no está registrado"
            })
        }
    
        req.session.user = {id: user.id, username: user.username, admin: false}
    
        res.send('login success')
        
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