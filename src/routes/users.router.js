import { Router } from "express";
import usersModel from "../models/users.model.js";

const usersRouter  = Router();

usersRouter.get('/', async (req, res) => {
    try {
        const users = await usersModel.find({})
        res.send(users)
    } catch (error) {
        console.log(error)
    }
})
    
usersRouter.post('/', async (req, res) => {
        try {
            const { first_name, last_name, email, password, phone_number } = req.body
            const newUser = {
                first_name,
                last_name,
                email,
                password,
                phone_number
            }

            const result =await usersModel.create(newUser)

            res.status(200).send({
                status: "success",
                message: `El usuario ${first_name} ${last_name} ha sido creado con éxito`,
                usersCreate: result
            })
        } catch (error) {
            console.log(error)
        }
    })

usersRouter.get('/:uid', async (req, res) => {
        try {
            const { uid } = req.params
            const user = await usersModel.findOne({ _id: uid })
            res.json({
                status: "success",
                message: `Usuario ${user.first_name} ${user.last_name} id "${uid}" encontrado`,
                result: user
            })
            res.send('get user')
        } catch (error) {
            console.log(error)
        }
    })

usersRouter.put('/:uid', async (req, res) => {
        try {
            const { uid } = req.params
            const userToUpdate = req.body

            const result = await usersModel.findByIdAndUpdate({ _id: uid }, userToUpdate, {new: true})//se usa para mostrar el usuario actualizado en tiempo real, dado que el sistema tenderá a mostrarnos el usuario actualizado pero sin actualizar
            res.status(200).send({
                status: "success",
                message: `El usuario ${result.first_name} ${result.last_name} con id "${uid}" ha sido actualizado`,
                result: result          
            })
        } catch (error) {
            console.log(error)
        }
    })

usersRouter.delete('/:uid', async (req, res) => {
        try {
            const { uid } = req.params
            const result = await usersModel.findByIdAndDelete({ _id: uid })
            res.status(200).send({
                status: 'success',
                message: `El usuario ${result.first_name} ${result.last_name} con id ${result._id} ha sido eliminado`
            })
        } catch (error) {
            console.log(error)
        }
    })

export default usersRouter