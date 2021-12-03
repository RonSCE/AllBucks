module.exports = class ProductDto {
    productName;
    category;
    price;
    imgUrl;
    inStock;
    salePrice;
    constructor(productName,category,price,imgUrl,inStock,salePrice) {
        this.productName = productName
        this.category = category
        this.price = price
        this.imgUrl = imgUrl
        this.inStock = inStock
        this.salePrice = salePrice
    }
    static productToDto(product){
        return new ProductDto(product.productName,product.category,
            product.price,product.imgUrl,product.inStock,product.salePrice)
    }
}