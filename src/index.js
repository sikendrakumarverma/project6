const express = require("express")
const mongoose = require("mongoose")
const app = express()
const route = require("./routes/route")

app.use(express.json())

mongoose.connect("mongodb+srv://sikendrakumar:wtCKMS5cQpIjdBOE@cluster0.oexuw0b.mongodb.net/project6Database",
    {useNewUrlParser:true}
).then(()=>console.log("mongoDb is connected"))
    .catch((err)=>console.log(err))

app.use("/",route)

app.use("/*", function (req, res) {
    return res.status(400).send({status: false,message: "Please Enter Valid Path Or Parameters !!!!",});
  });
  

app.listen(3000 , function(){
    console.log("Express is running on port 3000")
})