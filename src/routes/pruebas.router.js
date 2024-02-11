import { Router } from "express";

const pruebasRouter = Router();

pruebasRouter.get('/session', (req, res) => {
    if (req.session.counter){
        req.session.counter++
        res.send(`Ud a visitado el sitio ${req.session.counter} veces`)
    } else {
        req.session.counter = 1
        res.send('Bienvenido a la página')
    }
})

pruebasRouter.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if(error) return res.send('Logout error')
        res.send({
            status: 'success',
            message: 'logout ok'
        })
    })
})

export default pruebasRouter;