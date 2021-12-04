const productService = require('../service/product-service');
const ApiError = require('../exceptions/api-error');


class ProductController {
    static checkUserType(req){
        const {type} = req.user;
        if(type !== "Admin") {
            throw (ApiError.UnauthorizedError())
        }
    }
    async addProduct(req, res, next) {
        try {
            ProductController.checkUserType(req)
            const {productName,category,price,inStock,salePrice,isSpecial} = req.body;
            const imgUrl = req.file.filename;
            const product = await productService.addProduct(productName,category,price,imgUrl,inStock,salePrice,isSpecial)
            res.json({product})
        } catch (err) {
            next(err)
        }
    }

    async editProduct(req, res, next) {
        try {
            ProductController.checkUserType(req)
            const productName = req.params.name
            const {newProductName,category,price,inStock,salePrice,isSpecial} = req.body
            const imgUrl = req.file.filename;
            const product = await productService.editProduct(productName,newProductName,
                category,price,imgUrl,inStock,salePrice,isSpecial)
            res.json({product})
        } catch (err) {
            next(err)
        }
    }

    async getAllProducts(req, res, next) {
        try {
            const products = await productService.getAllProducts()
            res.json({products})
        } catch (err) {
            next(err)
        }
    }

    async getOneProduct(req, res, next) {
        try {
            const productName = req.params.name;
            const product = await productService.getOneProduct(productName)
            res.json({product})
        } catch (err) {
            next(err);
        }
    }

    async deleteProduct(req, res, next) {
        try {
            ProductController.checkUserType(req)
            const productName = req.params.name;
            await productService.deleteProduct(productName)
            res.json({result: "Success"})
        } catch (err) {
            next(err);
        }
    }


}

module.exports = new ProductController()