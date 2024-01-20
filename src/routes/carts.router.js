import { Router } from "express";
import cartsModel from "../models/carts.model.js";

const cartsRouter = Router();

cartsRouter.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const cartId = await cartsModel.findOne({ _id: cid })

        if (cartId.length !== 0) {
            res.status(200).send({
                status: "succes",
                cartId
            })
        }

    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: 'El carrito solicitado no existe o está vacío'
        })

    }

})

cartsRouter.post('/', async (req, res) => {
    try {
        const { products } = req.body
        const newCart = {
            products
        }
        const result = await cartsModel.create(newCart)

        res.status(201).send({
            status: "success",
            message: `El carrito ${result._id} ha sido agregado`,
            result: result
        })

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Error al agregar el carrito',
            error: error.message
        })
    }

})

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const cart = await cartsModel.findById({ _id: cid })

        if (!cart) {
            return res.status(400).send({
                status: 'error',
                message: 'El carrito no existe',
            })
        }

        const productToAdd = {
            product: pid,
            quantity: 15
        }

        cart.products.push(productToAdd)
        await cart.save()

        res.status(200).send({
            status: "succes",
            message: 'Producto agregado al carrito con éxito',
            result: cart
        })

    } catch (error) {
        res.status(404).send({
            status: 'error',
            mesagge: 'El carrito está vacio',
            result: cart
        })

    }

})

export default cartsRouter