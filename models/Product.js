const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema(
    {
        productName: {
            type:String,
            required: true,
            unique:true
        },
        category: {
            type:String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        imgUrl:{
            type:String
        },
        inStock:{
            type:Boolean,
            default:false
        },
        isSpecial:{
            type:Boolean,
            default:false
        },
        salePrice:{
            type: Number,
            default: null
        },
    },
)
module.exports = mongoose.model("Product", ProductSchema)