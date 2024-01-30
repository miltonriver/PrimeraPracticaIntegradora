import { Router } from "express";
import cartsModel from "../models/carts.model.js";
import mongoose from "mongoose";
import debug from "debug";

const log = debug('myapp:carts');
const cartsRouter = Router();
log("Este es un mensaje de depuración");


cartsRouter.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const cartId = await cartsModel.findOne({ _id: cid })
        console.log(JSON.stringify(cartId, null, '\t'))

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

/* cartsRouter.put('/:cid/product/:pid', async (req, res) => {
    console.log("Ruta PUT '/:cid/product/:pid' alcanzada");
    res.send("OK");
}); */

cartsRouter.put('/:cid/product/:pid', async (req, res) => {
    log('Entrando al método PUT /:cid/product/:pid');
    try {
        const { cid, pid } = req.params;
        const { newQuantity } = req.body;
        log("Ruta PUT '/:cid/product/:pid' alcanzada");

        console.log("Valor de cid:", cid);

        const cart = await cartsModel.findOne({_id: cid}).catch(err => {
            console.error('Error al intentar encontrar el carrito:', err);
            throw err;
        })

        console.log("Este es el contenido del carrito encontrado:", cart);

        if (!cart) {
            return res.status(404).send({
                status: 'error',
                message: 'El carrito solicitado no existe.',
            });
        }

        if (cart.products.length === 0) {
            return res.status(400).send({
                status: 'error',
                message: 'El carrito está vacío.',
            });
        }

        const productId = mongoose.Types.ObjectId(pid);

        const productIndex = cart.products.findIndex(
            (product) => product.product.toString() === productId.toString()
        );

        console.log("Índice del producto en el carrito:", productIndex);

        if (productIndex === -1) {
            return res.status(404).send({
                status: 'error',
                message: `Producto con ID ${pid} no encontrado en el carrito.`,
            });
        }

        // Actualiza la cantidad del producto
        cart.products[productIndex].quantity = newQuantity;

        // Guarda los cambios en el carrito
        const updatedCart = await cart.save();

        console.log("Carrito actualizado exitosamente:", updatedCart);

        return res.status(200).send({
            status: 'success',
            message: `Cantidad del producto con ID ${pid} actualizada con éxito.`,
            result: updatedCart,
        });
    } catch (error) {
        console.error('Error al intentar actualizar la cantidad del producto en el carrito:', error);
        log('Error en el método PUT /:cid/product/:pid:', error);

        // Agrega mensajes de consola adicionales para depurar
        console.log("Error name:", error.name);
        console.log("Error message:", error.message);

        return res.status(500).send({
            status: 'error',
            message: 'Error interno al intentar actualizar la cantidad del producto en el carrito.',
            result: error,
        });
    }
});


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

cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const cart = await cartsModel.findById({ _id: cid })
        console.log("este es el contenido del carrito", cart)

        if (!cart) {
            return res.status(404).send({
                status: 'error',
                message: 'El carrito solicitado no existe.',
            });
        }
    
        if (cart.products.length < 0) {
            return res.status(400).send({
                status: 'error',
                message: 'El carrito está vacío, no se puede eliminar',
            })
        }

        const productIndex = cart.products.findIndex(
            (product) => product.product.toString() === pid
        );

        cart.products.splice(productIndex, 1);

        await cart.save();

        res.status(200).send({
            status: "success",
            message: `El producto con ID ${pid} ha sido eliminado del carrito con ID ${cid}.`,
            result: cart
        })
    } catch (error) {
        res.status(404).send({
            status: 'error',
            mesagge: 'Error interno al intentar eliminar el producto del carrito',
            result: error
        })
    }
})

export default cartsRouter