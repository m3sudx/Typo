import 'dotenv/config'
import express from "express";
import cors from "cors"
import errorHandler from "./src/middleware/errorhandler.js";
import authRouter from "./src/routes/auth.route.js"
import conversationRouter from "./src/routes/converation.route.js"

const app=express()

app.use(cors())
app.use(express.json())

// routes
app.use('/api/auth',authRouter)
app.use('/api/conversations',conversationRouter)

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "working",
  });
});



app.use(errorHandler)

app.listen(3003,()=>{
console.log("server running on 3003")
})