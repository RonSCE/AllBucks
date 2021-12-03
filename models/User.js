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
        numOfCoffeeCups:{
            type:Number,
            required: false
        },
    }, {timestamps: true}
)
module.exports = mongoose.model("User", UserSchema)