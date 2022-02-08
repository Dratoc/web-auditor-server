const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchame = Schema (
    {
        name: String,
        email: {
            type:String,
            unique: true
        },
        password: String,
        role: String,
        active: Boolean,
        remember: Boolean, 
        avatar: String
    }
)

module.exports = mongoose.model("User", UserSchame);