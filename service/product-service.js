const Product = require('../models/Product')
const ApiError = require('../exceptions/api-error')
const ProductDto = require('../dto/product-dto')

class ProductService {
    async addProduct(productName,category,price,imgUrl,inStock,salePrice,isSpecial,desc) {
        const existsProduct = await Product.findOne({productName})
        if(existsProduct){
            throw ApiError.BadRequest(`Product with name ${productName} Already Exists`)
        }
        const product = await Product.create({productName,category,price,imgUrl,inStock,salePrice,isSpecial,desc})
        return ProductDto.productToDto(product)
    }
    async editProduct(productName,newProductName,category,price,imgUrl,inStock,salePrice,isSpecial,desc) {
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
        if(desc){
            product.desc = desc
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
        if(typeof isSpecial === "boolean"){
            product.isSpecial = isSpecial
        }
        await product.save()
        return ProductDto.productToDto(product)
    }

    async getAllProducts() {
        const products = await Product.find({})
        return products.map(prod => ProductDto.productToDto(prod))
    }

    async getOneProduct(productName) {
        try {
            const product = await Product.findOne({productName})
            return ProductDto.productToDto(product)
        }
        catch (e) {
            throw ApiError.BadRequest(`Product '${productName}'does not exists`)
        }
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