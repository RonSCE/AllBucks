const productService = require('../service/product-service');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');


class ProductController {
    static checkForValidationErrors(req){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw (ApiError.BadRequest('Validation Error', errors.array()))
        }
    }
    static checkUserType(req){
        const {type} = req.user;
        if(type !== "Admin") {
            throw (ApiError.UnauthorizedError())
        }
    }
    async addProduct(req, res, next) {
        try {
            ProductController.checkUserType(req)
            ProductController.checkForValidationErrors(req)
            const {productName,category,price,imgUrl,inStock,salePrice} = req.body;
            const product = await productService.addProduct(productName,category,price,imgUrl,inStock,salePrice)
            res.json({product})
        } catch (err) {
            next(err)
        }
    }

    async editProduct(req, res, next) {
        try {
            ProductController.checkUserType(req)
            ProductController.checkForValidationErrors(req)
            const productName = req.params.name
            const {newProductName,category,price,imgUrl,inStock,salePrice} = req.body
            const product = await productService.editProduct(productName,newProductName,
                category,price,imgUrl,inStock,salePrice)
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
            res.json({resultCode: 0})
        } catch (err) {
            next(err);
        }
    }


}

module.exports = new ProductController()