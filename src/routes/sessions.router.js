import { Router } from "express";
import auth from "../middleware/authentication.middleware.js";
import UserManagerMongo from "../manager/Mongo/userManagerMongo.js";
import productsModel from "../models/products.model.js";
import { createHash, isValidPassword } from "../utils/hashBcrypt.js";
import passport from "passport";

const sessionsRouter = Router()
const sessionService = new UserManagerMongo()

sessionsRouter.get('/login', (req, res) => {
    res.send('login success')
})

sessionsRouter.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, username, email, password, phone_number } = req.body

        if (!first_name || !last_name || !username || !email || !password) {
            return res.send("Quedan campos sin llenar, por favor ingrese los campos que son obligatorios")
        }

        const newUser = {
            first_name,
            last_name,
            username,
            email,
            password: createHash(password),
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

sessionsRouter.post('/registerpassport', passport.authenticate('registerpassport', { failureRedirect: '/api/sessions/failregister' }), async (req, res) => {
    const username = req.body.username || (req.user && req.user.username);

    res.render('registerSuccessPassport', {
        username: username,
        style: "index.css"
    })
})

sessionsRouter.get('/failregister', async (req, res) => {
    res.send({ error: 'falla en el register' })
})

sessionsRouter.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await sessionService.getUser(username)
        console.log("mostrar el contenido de user", user)

        if (user.email === "adminCoder@coder.com") {
            user.role = "admin",
                res.render('adminPage', {
                    username: username,
                    style: 'index.css'
                })
        }

        if (!user) {
            return res.send({
                status: "error",
                error: "El usuario no existe o no está registrado"
            })
        }

        if (!isValidPassword(password, user.password)) return res.status(401).send('no coinciden las credenciales')

        req.session.user = { id: user.id, username: user.username, admin: true }

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
        if (error) return res.send('Logout error')
        res.send({
            status: 'success',
            message: 'logout ok'
        })
    })
})

sessionsRouter.post('/loginpassport', passport.authenticate('loginpassport', { failureRedirect: '/api/sessions/faillogin' }), async (req, res) => {
    if (!req.user) return res.status(401).send({ status: "error", error: "credenciales inválidas" })

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        phone_number: req.user.phone_number
    }

    const username = req.body.username || (req.user && req.user.username);
    const products = await productsModel.find({})
        res.render('productosActualizados', {
            username: username,
            productos: products,
            style: 'index.css'
        })
})

sessionsRouter.get('/faillogin', async (req, res) => {
    console.log("Failed Strategy")
    res.send({ error: 'falla al intentar loguearse' })
})

sessionsRouter.get('/github', passport.authenticate('github', {scope:['user:login']}), async (req, res) => {})

sessionsRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/api/sessions/loginpassport'}), async (req, res) => {
    req.session.user = req.user
    res.redirect('/realtimeproducts')
})

sessionsRouter.get('/current', auth, async (req, res) => {
    try {
        res.send('<h1>Datos sensibles</h1>')
    } catch (error) {
        res.send({
            status: "error",
            error: error.message
        })
    }
})


export default sessionsRouter