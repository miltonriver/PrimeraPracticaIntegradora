import { Router } from "express";
import productsModel from "../models/products.model.js";

const productsRouter = Router();

productsRouter.get('/', async (req, res) => {
    try {
        // const products = await productsModel.find({})
        const products = await productsModel.paginate({})
        res.status(200).send({
            status: 'succes',
            message: 'Colección de productos',
            result: products
        })
    } catch (error) {
        console.log(error)
        return error
    }
});

productsRouter.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const product = await productsModel.findOne({_id: pid})
        res.status(200).send({
            status: 'succes',
            message: `Producto ${product.title} con id "${pid}" encontrado`,
            result: product
        })
    } catch (error) {
        console.log(error)
        return error
    }
})

productsRouter.post('/', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock, status, category } = req.body;
        const newProduct = { 
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status,
            category
        }
        const result = await productsModel.create(newProduct)

        res.status(201).send({
            status: "success",
            message: `El producto de nombre ${newProduct.title} con código ${newProduct.code} ha sido agregado exitosamente`,
            result: result
        });
    } catch (error) {
        console.error('Error al agregar producto', error)
        res.status(500).send({
            status: 'error',
            message: 'Error interno al agregar producto'
        })
    }
})

productsRouter.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const productToUpdate = req.body

        const result = await productsModel.findByIdAndUpdate({ _id: pid}, productToUpdate, {new: true})

        res.status(200).send({
            status: 'succes',
            message: `El producto ${productToUpdate.title} con código ${productToUpdate.code} ha sido actualizado`,
            result: result
        })
    } catch (error) {
        console.error('Error al intentar actualizar el producto', error)
        res.status(500).send({
            status: 'error',
            message: 'Error interno al actualizar el producto'
        })
    }
})

productsRouter.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const deleteProduct = await productsModel.findByIdAndDelete({_id: pid})

        if (!deleteProduct) {
            return res.status(400).send({
                status: 'Error',
                message: `El producto cuyo ID es "${pid}" no existe dentro del catálogo`,
                deleteProduct
            })
        }

        return res.status(200).send({
            status: 'succes',
            message: `El producto ${deleteProduct.title} de ID "${pid}" ha sido eliminado`,
        })

    } catch (error) {
        console.error('Error al intentar eliminar el producto:', error);
        res.status(500).send({
            status: error,
            message: 'Error interno al intentar eliminar el producto'
        });
    }
})

export default productsRouter