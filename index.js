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
const { count } = require('./userModel')


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
    if(date==="" || date==="Invalid Date"){
      newExercise=new Exercise({
        description,
        duration,
      }
      )
    }
    else{
      newExercise=await new Exercise({
        description,
        duration,
        date:new Date(date)
      })
      
    }
    const user=await User.findById(id)
    await user.log.push(newExercise)
    await user.save()

    const response={
      username:user.username,
      description:newExercise.description,
      duration:newExercise.duration,
      date:new Date(newExercise.date).toDateString(),
      _id:user.id

    }

    res.send(response)

    
    console.log(response)
 
    console.log("user updated",user)
    
  }
  catch(err){
    res.sendStatus(403)

  }

})

app.get("/api/users/:_id/logs",async(req,res)=>{
  const id=req.params._id
  const user=await User.findById(id)
  let response={
    _id:id,
    username:user.username,
    log:[...user.log]
  
   
  }
  
  const {from,to,limit}=req.query
  if(from){
    const unixFrom=Date.parse(from)
    if(unixFrom==="Invalid Date")res.send("Invalid date")
    response.log=response.log.filter(e=>{
      const unixDate=Date.parse(e.date)
      if(unixDate>=unixFrom)return true
      else{
        return false
      }
    })

  }
  if(to){
    const unixTo=Date.parse(to)
    if(unixTo==="Invalid Date")res.send("Invalid date")
    response.log=response.log.filter(e=>{
      const unixDate=Date.parse(e.date)
      if(unixDate<=unixTo)return true
      else{
        return false
      }
    })

  }
  if(limit && parseInt(limit)!==NaN){
    response.log=response.log.slice(0,limit)    
  }

  
  
  



  response.count=response.log.length
  response.log=response.log.map(e=>
    {
      return {...e._doc,date:new Date(e.date).toDateString()}
    }
  )

  
  
  res.send(response)
  
})







app.get("/api/users",async(req,res)=>{
  const allUser=await User.find({},"username id")
  res.send(allUser)

})






const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
