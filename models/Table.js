const mongoose = require("mongoose")

const TableSchema = new mongoose.Schema(
    {
        tableNum: {
            type:Number,
            required: true,
            unique:true
        },
        capacity: {
            type:Number,
            required: true,
        },
        isAvailable: {
            type: Boolean,
            default:false
        },
        location:{
            isInside:Boolean,
            default:true
        },
    },
)
module.exports = mongoose.model("Table", TableSchema)