const mongoose=require("mongoose")
const blogSchema= new mongoose.Schema({
    title:{
        type:String,
        require:[true,"Blog must have a title"]
    },
    body:{
        type:String,
        require:[true,"Blog must have a body"]
    },
   
},{
        timestamps:true
    })

const Blog=mongoose.model("Blog",blogSchema)
module.exports=Blog 