const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        cid: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true
        },
        userType:{
            type:String,
            default:"Member"
        },
        points:{
            type:Number,
            default: 0
        },
    }, {timestamps: true}
)
module.exports = mongoose.model("User", UserSchema)