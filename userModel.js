const mongoose=require("mongoose")
const {exerciseSchema} = require('./exerciseModel.js')

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    log:[exerciseSchema]
})


module.exports=mongoose.model("User",userSchema)