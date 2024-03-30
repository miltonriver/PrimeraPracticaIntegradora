import { Router } from "express";
import sendEmail from "../utils/sendEmail.js";
import sendSms from "../utils/sendSMS.js";

const pruebasRouter = Router();

pruebasRouter.get('/session', (req, res) => {
    if (req.session.counter) {
        req.session.counter++
        res.send(`Ud a visitado el sitio ${req.session.counter} veces`)
    } else {
        req.session.counter = 1
        res.send('Bienvenido a la página')
    }
})

pruebasRouter.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) return res.send('Logout error')
        res.send({
            status: 'success',
            message: 'logout ok'
        })
    })
})

pruebasRouter.get('/mail', (req, res) => {
    const destinatario = 'miltonriver66@gmail.com'
    const subject = 'Email de prueba ecommerce Milton'
    const html = '<div><h1>Este es otro email de prueba minuto 36:20 del video</h1></div>'

    sendEmail(destinatario, subject, html)

    res.send('email enviado')
})

pruebasRouter.get('/sms', (req, res) => {
    sendSms('Milton', 'Petitfour')

    res.send("sms enviado")
})

export default pruebasRouter;