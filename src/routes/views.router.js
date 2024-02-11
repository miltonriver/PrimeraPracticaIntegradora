import { Router } from "express";
import productsModel from "../models/products.model.js";
import usersModel from "../models/users.model.js";

const router = Router()

router.get('/', (req, res) => {
    res.render("index", {
        style: 'index.css'
    })
})

router.get('/register', (req, res) => {
    res.render('register', {
        style: 'index.css'
    })
})

router.get('/login', (req, res) => {
    res.render('login', {
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

router.get('/users', async (req, res) => {
    try {
        const { limit = 10, pageQuery= 1, sort } = req.query
        let sortOption = {}
        if (sort) {
            sortOption = {[sort]: 1}
        }

        const {
            docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page,
            totalPages
        } = await usersModel.paginate({}, {limit, page: pageQuery, sort: sortOption, lean: true})
        res.render('users', {
            users: docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page,
            totalPages,
            style: 'index.css'
        })
        
    } catch (error) {
        console.log(error);
        res.render("Error al intentar obtener la lista de usuarios!");
        return;
    }
})

router.get('/products', async (req, res) => {
    try {
        const { limit = 5, pageQuery= 1, sort } = req.query
        let sortOption = {}
        if (sort) {
            sortOption = {[sort]: 1}
        }
        const {
            docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page,
            totalPages
        } = await productsModel.paginate({}, {limit, page: pageQuery, sort: sortOption, lean: true})
        res.render('products', {
            products: docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page,
            totalPages,
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