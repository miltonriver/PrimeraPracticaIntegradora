import productModel from "../../models/products.model.js"

class ProductManagerMongo {
    async getProducts(){
        return await productModel.paginate({})
    }

    async getProduct(pid){
        return await productModel.findOne({_id: pid})
    }
    
    async createProduct(newProduct){
        return await productModel.create(newProduct)
    }
    
    async updateProduct(pid, productToUpdate){
        return await productModel.findOneAndUpdate({_id: pid}, productToUpdate, {new: true})
    }
    
    async deleteProduct(pid){
        return await productModel.deleteOne({_id: pid})
    }
}

export default ProductManagerMongo