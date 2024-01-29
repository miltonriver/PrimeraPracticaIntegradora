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
        const cart = await cartsModel.findById({ _id: cid })
        const { cid, pid } = req.params
        console.log("este es el contenido del carrito", cart)
        
        if (cart.products.length < 0) {
            return res.status(400).send({
                status: 'error',
                message: 'El carrito está vacío',
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
            mesagge: 'El carrito solicitado no existe',
            result: error
        })
    }
})

cartsRouter.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const productToAddToCart = req.body
        console.log("contenido que quiero actualizar:", productToAddToCart)
    
        const cartToUpdate = await cartsModel.findById({ _id: cid })
        console.log("contenido del carrito encontrado: ", cartToUpdate)
        cartToUpdate.products.push(productToAddToCart)
        console.log("contenido del array:", cartToUpdate.products)
        console.log("contenido actualizado del carrito: ", cartToUpdate)
        await cartToUpdate.save()
    
        res.status(200).send({
            status: 'succes',
            message: `El carrito de ID ${cartToUpdate._id} ha sido actualizado`,
            result: cartToUpdate
        })
        
    } catch (error) {
        console.error('Error al intentar actualizar el carrito:', error);
        res.status(400).send({
            status: 'error',
            message: 'Error interno al intentar actualizar el carrito'
        })
    }
})

cartsRouter.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const deleteCart = await cartsModel.findByIdAndDelete({_id: cid})
        console.log(deleteCart)
    
        if (!deleteCart) {
            return res.status(400).send({
                status: 'Error',
                message: `El carrito cuyo ID es "${cid}" no existe`,
                deleteProduct
            })
        }
    
        res.status(200).send({
            status: 'success',
            message: `El carrito de ID "${cid}" ha sido eliminado`
        })        
    } catch (error) {
        console.error('Error al intentar eliminar el carrito:', error);
        res.status(500).send({
            status: error,
            message: 'Error interno al intentar eliminar el carrito'
        });
    }
})

export default cartsRouter