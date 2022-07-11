const mongoose=require("mongoose")

const exerciseSchema=new mongoose.Schema({

      description:{
          type:String,
          required:true,
      },
      duration:{
        type:Number,
        required:true,
      },
      date:{
          type:String,
          default:Date.now
      }  
    
})




module.exports={
  Exercise:mongoose.model("Exercise",exerciseSchema),
  exerciseSchema
}