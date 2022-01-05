module.exports = class ProductDto {
    productName;
    category;
    price;
    imgUrl;
    inStock;
    salePrice;
    isSpecial;
    desc;
    constructor(productName,category,price,imgUrl,inStock,salePrice,isSpecial,desc) {
        this.productName = productName
        this.category = category
        this.price = price
        this.imgUrl = imgUrl
        this.inStock = inStock
        this.salePrice = salePrice
        this.isSpecial = isSpecial
        this.desc = desc
    }
    static productToDto(product){
        return new ProductDto(product.productName,product.category,
            product.price,`https://localhost:5000/${product.imgUrl}`,product.inStock,product.salePrice,product.isSpecial,product.desc)
    }
}