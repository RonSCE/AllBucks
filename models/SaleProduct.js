const mongoose = require("mongoose")
const SaleSchema = new mongoose.Schema(
    {
        productName: {
            type:String,
            required: true,
            unique:true
        },
        updatedPrice: {
            type: Number,
            required: true,
        },
    },
)
module.exports = mongoose.model("SaleProduct", SaleSchema)