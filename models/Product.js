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
            type:String,
            unique:true
        },
        inStock:{
            type:Boolean,
            default:false
        },
    },
)
module.exports = mongoose.model("Product", ProductSchema)