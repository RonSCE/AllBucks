const mongoose = require("mongoose")
const Product = {
    productName: {type: String, require:true},
    quantity: {type: Number, default: 1},
    price: {type: Number,required:true}
}
const OrderSchema = new mongoose.Schema(
    {
        orderedBy: {
            type:String,
            default: "Guest"
        },
        status: {
            type: String,
            default:"In-Progress"
        },
        orderedItems:[Product]
    },{timestamps: true}
)
module.exports = mongoose.model("Order", OrderSchema)