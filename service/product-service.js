const Product = require('../models/Product')
const ApiError = require('../exceptions/api-error')
const ProductDto = require('../dto/product-dto')

class ProductService {
    async addProduct(productName,category,price,imgUrl,inStock,salePrice) {
        const existsProduct = await Product.findOne({productName})
        if(existsProduct){
            throw ApiError.BadRequest(`Product with name ${productName} Already Exists`)
        }
        const product = await Product.create({productName,category,price,imgUrl,inStock,salePrice})
        return ProductDto.productToDto(product)
    }
    async editProduct(productName,newProductName,category,price,imgUrl,inStock,salePrice) {
        const product = await Product.findOne({productName})
        if (!product) {
            throw ApiError.BadRequest("Product not exists")
        }
        if(productName !== newProductName){
            const existsProduct = await Product.findOne({productName:newProductName})
            if(existsProduct){
                throw ApiError.BadRequest(`Product with name ${productName} Already Exists`)
            }
        }
        if(newProductName){
            product.productName = newProductName
        }
        if(salePrice){
            product.salePrice = salePrice
        }
        if(category){
            product.category = category
        }
        if(price){
            product.price = price
        }
        if(imgUrl){
            product.imgUrl = imgUrl
        }
        if(typeof inStock === "boolean"){
            product.inStock = inStock
        }
        await product.save()
        return ProductDto.productToDto(product)
    }

    async getAllProducts() {
        const products = await Product.find({})
        return products.map(prod => ProductDto.productToDto(prod))
    }

    async getOneProduct(productName) {
        const product = await Product.findOne({productName})
        return ProductDto.productToDto(product)
    }

    async deleteProduct(productName) {
        const product = await Product.findOne({productName})
        if (!product) {
            throw ApiError.BadRequest("Product does not exists")
        }
        await Product.findOneAndDelete({productName})
    }


}

module.exports = new ProductService();