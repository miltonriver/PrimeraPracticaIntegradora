import UserManagerMongo from "../manager/Mongo/userManagerMongo.js";

class UserController {
    constructor(){
        this.userService = new UserManagerMongo()
    }
    getUsers   = async (req, res) => {
        try {
            const users = await this.userService.getUsers()
            res.send(users)
        } catch (error) {
            console.log(error)
        }
    }
    
    getUser    = async (req, res) => {
        try {
            const { username } = req.params
            const user = await this.userService.getUser(username)
            res.json({
                status: "success",
                message: `Usuario ${user.first_name} ${user.last_name} encontrado`,
                result: user
            })
            res.send('get user')
        } catch (error) {
            console.log(error)
        }
    }
    
    createUser = async (req, res) => {
        try {
            const { first_name, last_name, email, username, password, phone_number } = req.body
            const newUser = {
                first_name,
                last_name,
                email,
                username,
                password,
                phone_number
            }
    
            const result =await this.userService.createUser(newUser)
    
            res.status(200).send({
                status: "success",
                message: `El usuario ${first_name} ${last_name} ha sido creado con éxito`,
                usersCreate: result
            })
        } catch (error) {
            console.log(error)
        }
    }
    
    updateUser = async (req, res) => {
        try {
            const { uid } = req.params
            const userToUpdate = req.body
    
            const result = await this.userService.updateUser(uid, userToUpdate) //se usa para mostrar el usuario actualizado en tiempo real, dado que el sistema tenderá a mostrarnos el usuario actualizado pero sin actualizar
            res.status(200).send({
                status: "success",
                message: `El usuario ${result.first_name} ${result.last_name} con id "${uid}" ha sido actualizado`,
                result: result          
            })
        } catch (error) {
            console.log(error)
        }
    }
    
    deleteUser = async (req, res) => {
        try {
            const { uid } = req.params
            const result = await this.userService.deleteUser({ _id: uid })
            res.status(200).send({
                status: 'success',
                message: `El usuario seleccionado ha sido eliminado exitosamente`
            })
        } catch (error) {
            console.log(error)
        }
    }
}

export default UserController