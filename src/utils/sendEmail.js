import nodemailer from "nodemailer";
import debug from "debug";
import { configObject } from "../config/connectDB.js";
import __dirname from "../utils.js";

const transporterDebug = debug("nodemailer:transporter")
let transport;

try {
    transport = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        auth: {
            user: configObject.gmail_user,
            pass: configObject.gmail_password
        },
        debug: true
    })
    // console.log("Contenido de la const transport:", transport)
} catch (error) {
    console.error("Error al crear el transporte de nodemailer:", error);
}

transport.on("debug", (info) => {
    transporterDebug(info)
})

if (!transport) {
    console.error("El transporte de nodemailer no se ha configurado correctamente");
}

const sendEmail = async (to, subject, html) => {
    if (!transport) {
        console.error("transport no está definido");
        return
    }

    try {
        await transport.sendMail({
            from: 'Coder test <miltonriver66@gmail.com>',
            to,
            subject,
            html,
            attachments: [{//para agregar una imagen al mail
                filename: 'ases.png',
                path: __dirname + '/utils/ases.png',//ruta de la imagen
                cid: 'ases'
            }]
        })
    } catch (error) {
        console.error('Error sending email:', error);
    }
}


export default sendEmail