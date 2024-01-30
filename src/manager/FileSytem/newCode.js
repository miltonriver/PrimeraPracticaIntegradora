cartsRouter.put('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const { newQuantity } = req.body
        console.log("Valor de cid:", cid);
        const cart = await cartsModel.findById(cid)
        console.log("este es el contenido del carrito", cart)

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
            (product) => product.product.toString() === pid
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
})