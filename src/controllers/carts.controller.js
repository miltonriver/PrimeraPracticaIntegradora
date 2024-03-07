import CartManagerMongo from "../manager/Mongo/cartsManagerMongo.js";

class CartController {
    constructor() {
        this.cartService = new CartManagerMongo()
    }

    getCarts            = async (req, res) => {
        try {
            const carts = await this.cartService.getCarts()
            res.send(carts)
        } catch (error) {
            console.log(error)
        }
    }

    getCart             = async (req, res) => {
        try {
            const { cid } = req.params
            const cartId = await this.cartService.getCart({ _id: cid })
            // console.log(JSON.stringify(cartId, null, '\t'))

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
    }

    createCart          = async (req, res) => {
        try {
            const { products } = req.body
            const newCart = {
                products
            }
            const result = await this.cartService.createCart(newCart)

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
    }

    createProductInCart = async (req, res) => {
        try {
            const { cid, pid } = req.params
            const cart = await this.cartService.getCart({ _id: cid })
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
    }

    updateCart          = async (req, res) => {
        try {
            const { cid } = req.params
            const productToAddToCart = req.body
            // console.log("contenido que quiero actualizar:", productToAddToCart)

            const cartToUpdate = await this.cartService.updateCart({ _id: cid })
            // console.log("contenido del carrito encontrado: ", cartToUpdate)
            cartToUpdate.products.push(productToAddToCart)
            // console.log("contenido del array:", cartToUpdate.products)
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
    }

    updateProductInCart = async (req, res) => {
        // log("Entrando a la ruta PUT '/:cid/product/:pid'");
        try {
            const { cid, pid } = req.params
            const { newQuantity } = req.body
            // log(`Valor de cid: ${cid}`)
            const cart = await this.cartService.getCart({ _id: cid })
            console.log(JSON.stringify(cart, null, '\t'))

            if (!cart) {
                return res.status(404).send({
                    status: 'error',
                    message: 'El carrito solicitado no existe.',
                });
            }

            if (cart.products.length === 0) {
                return res.status(400).send({
                    status: 'error',
                    message: 'El carrito está vacío',
                })
            }

            const productIndex = cart.products.findIndex(
                (product) => product.product._id.toString() === pid
            );
            console.log("contenido del carrito encontrado: ", productIndex)

            if (productIndex === -1) {
                return res.status(404).send({
                    status: 'error',
                    message: `Producto con ID ${pid} no encontrado en el carrito.`,
                });
            }

            cart.products[productIndex].quantity = newQuantity
            await cart.save()

            res.status(200).send({
                status: "succes",
                message: `Cantidad del producto con ID ${pid} actualizada con éxito.`,
                result: cart
            })

        } catch (error) {
            console.error('Error al intentar actualizar la cantidad del producto en el carrito:', error);
            return res.status(404).send({
                status: 'error',
                mesagge: 'Error interno al intentar actualizar la cantidad del producto en el carrito.',
                result: error
            })
        }
    }

    deleteCart          = async (req, res) => {
        try {
            const { cid } = req.params
            const deleteCart = await this.cartService.deleteCart({ _id: cid })
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
    }

    deleteProductInCart = async (req, res) => {
        try {
            const { cid, pid } = req.params
            const cart = await this.cartService.getCart({ _id: cid })
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
    }
}

export default CartController