const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
var bodyParser = require('body-parser')
const mongoose=require("mongoose")

// connect mongoose to db

mongoose.connect("mongodb://localhost/")


// express model
const User=require("./userModel")
const {Exercise} = require('./exerciseModel.js')


app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json

app.use(bodyParser.json())

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post("/api/users",(req,res)=>{
  
  const newUser=new User({username:req.body.username})
  newUser.save().then(e=>console.log("user save"))
  res.send(
    {
      username:newUser.username,
      _id:newUser.id
    
    })
})
app.post('/api/users/:_id/exercises',async(req,res)=>{
  const {description,duration,date}=req.body
  const id=req.params._id
  console.log(req.body)
  if(!req.params._id)res.sendStatus(404)


  try{
    let newExercise
    if(date===""){
      newExercise=new Exercise({
        description,
        duration,
        
      }
      )
    }
    else{
      newExercise=new Exercise({
        description,
        duration,
        date
      }
      )
    }
    const user=await User.findById(id)
    await user.log.push(newExercise)
    await user.save()

    res.send(await User.findById(id,{__v:0}))

    

    
    
    console.log("user updated",user)
  }
  catch(err){
    console.log(err.message)

  }

})
app.get("/api/users",async(req,res)=>{
  const allUser=await User.find({},"username id")
  res.send(allUser)

})






const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
