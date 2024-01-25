import { Router } from "express";
import productsModel from "../models/products.model.js";

const router = Router()

router.get('/', (req, res) => {
    res.render("index", {
        style: 'index.css'
    })
})

router.get('/chatbox', (req, res) => {
    res.render('chat', {
        style: 'index.css'
    })
})

router.get('/realtimeproducts', async (req, res) => {

    try {
        const products = await productsModel.find({})
        // console.log(products)
        res.render('realTimeProducts', {
            productos: products,
            style: 'index.css'
        })
    } catch (error) {
        console.log(error);
        res.render("Error al intentar obtener la lista de productos!");
        return;
    }
})

router.post('/', async (req, res) => {
    try {
        const products = await productsModel.find({})
        res.render('realTimeProducts', {
            productos: products,
            style: 'index.css'
        })
    } catch (error) {
        console.log(error);
        res.render("Error al intentar obtener la lista de productos!");
        return;
    }
})

export default router