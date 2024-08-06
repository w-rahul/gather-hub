import express from "express"

export const authRouter = express.Router()

authRouter.post("/register", (req,res)=>{
    res.send({
        mssg: "Hello from register"
    })
})

authRouter.post("/login", (req,res)=>{
    res.send({
        mssg : "Hello from login"
    })
})

authRouter.get("/logout",(req,res)=>{
    res.send({
        mssg: "Auth router is working fine"
    })
})