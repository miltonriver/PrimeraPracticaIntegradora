import UserManagerMongo from "../manager/Mongo/userManagerMongo.js";
import ProductManagerMongo from "../manager/Mongo/productsManagerMongo.js";

export class ViewUserController {
    constructor(){
        this.viewsRouterService = new UserManagerMongo()
    }

    index = (req, res) => {
        res.render("index", {
            style: 'index.css'
        })
    }

    register = (req, res) => {
        res.render('register', {
            style: 'index.css'
        })
    }

    registerPassport = (req, res) => {
        res.render('registerpassport', {
            style: 'index.css'
        })
    }

    login = (req, res) => {
        res.render('login', {
            style: 'index.css'
        })
    }

    loginPassport = (req, res) => {
        res.render('loginpassport', {
            style: 'index.css'
        })
    }

    chatbox = (req, res) => {
        res.render('chat', {
            style: 'index.css'
        })
    }

    usersList = async (req, res) => {
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
            } = await this.viewsRouterService.getUsersPaginate(parseInt(pageQuery) , parseInt(limit));
            console.log(docs)
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
    }
}

export class ViewProductController {
    constructor(){
        this.viewsRouterService = new ProductManagerMongo()
    }

    realTimeProducts = async (req, res) => {

        try {
            const products = await this.viewsRouterService.getProducts()
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
    }

    productosActualizados = async (req, res) => {

        try {
            const products = await this.viewsRouterService.getProducts()
            // console.log(products)
            res.render('productosActualizados', {
                username: req.session.username,
                productos: products,
                style: 'index.css'
            })
        } catch (error) {
            console.log(error);
            res.render("Error al intentar obtener la lista de productos!");
            return;
        }
    }
    
    products = async (req, res) => {
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
            } = await this.viewsRouterService.getProducts({}, {limit, page: pageQuery, sort: sortOption, lean: true})
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
    }

    getProducts = async (req, res) => {
        try {
            const products = await this.viewsRouterService.getProducts()
            res.render('realTimeProducts', {
                productos: products,
                style: 'index.css'
            })
        } catch (error) {
            console.log(error);
            res.render("Error al intentar obtener la lista de productos!");
            return;
        }
    }
}