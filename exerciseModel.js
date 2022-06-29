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
          default: function (){
            let date=new Date().toUTCString()
            date=date.split(" ")
            date=date.slice(0,5)
            return date.join(" ")

          }
          
      }  
    
})

module.exports.exerciseSchema=exerciseSchema


module.exports={
  Exercise:mongoose.model("Exercise",exerciseSchema),
  exerciseSchema
}