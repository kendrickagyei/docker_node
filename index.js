const express=require("express")
const app=express()
const session=require("express-session")
const cors=require("cors")
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require("./config/config")
const redis=require("redis")
const {RedisStore}=require("connect-redis")
const redisClient = redis.createClient({
  url: `redis://${REDIS_URL}:${REDIS_PORT}`
})


const postRouter=require("./Routes/PostRoutes")
const userRouter=require("./Routes/userRoutes")
const mongoose=require("mongoose")
const mongoURL=`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`
// const mongoURL=mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`).then(
//     ()=>console.log("successfully connected to database")
// ).catch((e)=>console.log("error"))
// Function to connect with retry logic
const connectWithRetry = () => {
  mongoose
    .connect(mongoURL, {
    })
    .then(() => console.log("successfully connected to DB"))
    .catch((e) => {
      console.log(e);
      console.log("Could not Connect");
      setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
    });
};
connectWithRetry()
app.enable("trust proxy")
// mongoose.connect("mongodb://root:example@172.18.0.2:27017/?authSource=admin").then(
//     ()=>console.log("successfully connected to database")
// ).catch((e)=>console.log("error"))

const PORT=process.env.PORT||5000
app.use(express.json())
app.use(cors({
}))
app.set("trust proxy",1)
redisClient.connect().catch(console.error)
app.use(
  session({
    store: new RedisStore({
      client: redisClient
    }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 30000,
      httpOnly: true
    }
  })
)

// app.get("/test-session", (req, res) => {
//   req.session.user = "test-user" // this creates/modifies the session
//   res.json({ session: req.session })
// })

app.get("/api/v1",(req,res)=>{
    res.send("<h1>We are here again and again and again</h1>")
})
app.use("/api/v1/posts",postRouter)
app.use("/api/v1/users",userRouter)

app.listen(PORT,()=>{
    console.log("Hello Word")
})
//172.18.0.3 ==node
//172.18.0.2 --mongo