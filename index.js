const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
var bodyParser = require('body-parser')
const dotenv=require("dotenv")

const mongoose=require("mongoose")

app.use(bodyParser.urlencoded({ extended: false }))


// connect mongoose to db

// mongoose.connect("mongodb://localhost/")


mongoose.connect("mongodb://Usopsontorian:WdKJPx2mhxzzK02G@cluster0-shard-00-00.et79p.mongodb.net:27017,cluster0-shard-00-01.et79p.mongodb.net:27017,cluster0-shard-00-02.et79p.mongodb.net:27017/?ssl=true&replicaSet=atlas-gfhr6p-shard-0&authSource=admin&retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true}).catch(err=>console.log(err.message))


// express model
const User=require("./userModel.js")
const {Exercise} = require('./exerciseModel.js')



// parse application/json

app.use(bodyParser.json())

app.use(cors())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});



app.post("/api/users",async(req,res)=>{
  const {username}=req.body
  
  try{
    const newUser= await new User({username})
    newUser.save()
    res.send(
      {
        username,
        _id:newUser.id
      
      })
  }
  catch(err){
    console.log(err.message)

  }
})


app.post('/api/users/:_id/exercises',async(req,res)=>{
  const {description,duration,date}=req.body
  const id=req.params._id
  

  try{
    let newExercise
    if(date==="" || !date){
      newExercise=await new Exercise({
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
    user.log.push(newExercise)
    user.save().then((resolve,reject)=>{
      const response={
        username:user.username,
        description:newExercise.description,
        duration:newExercise.duration,
        date:new Date(newExercise.date).toDateString(),
        _id:user.id
  
      }
  
      res.send(response)
    }
    ).catch(err=>{
      throw(err)
    })

   
    
  
    
  }
  catch(err){
    res.send(err.message)

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
      return {...e._doc,date:new Date(e._doc.date).toDateString()}
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
