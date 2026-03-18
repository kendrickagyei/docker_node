
const userModel=require("../model/userModel")
const bcrypt=require("bcrypt")
exports.signUp=async(req,res,next)=>{
try{
    const{username,password}=req.body
    const hashedPassword=await bcrypt.hash(password,12)
    const newUser=await userModel.create({
        username,
        password:hashedPassword
    })
    res.status(200).json({
        status:"success",
        message:"user created successfully",
        data:newUser
    })
}catch(error){
    res.status(400).json({
        status:"error",
        message: error.message || "Cannot create user",
    })
}
}
exports.login=async(req,res,next)=>{
try{
    const{username,password}=req.body
    const user=await userModel.findOne({username})
    if(!user){
        return res.status(404).json({
            status:"error",
            message:"user not found"
        })
    }
  const isCorrect=  bcrypt.compare(password,user.password)
   if(user&&isCorrect){
    req.session.user=user;
    return res.status(200).json({
        status:"success",
        message:"successfully logged in"
    })
   }else{
     res.status(400).json({
        status:"error",
        message:"Cannot log in"
    })
   }
}catch(error){
    res.status(400).json({
        status:"error",
        "message":error.message
    })
}
}