import express from "express"
import { PrismaClient } from "@prisma/client"
import dotenv from "dotenv"

const prisma = new PrismaClient()
// const JWT_SECRET = process.env.JWT_SECRET as string
// dotenv.config();

export const userRouter = express.Router()

userRouter.get("/", async (req,res)=>{
    try {
        const user = await prisma.user.findMany({})
        res.status(200).json({
            user
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
    
})

userRouter.get("/:id", async (req,res)=>{
    const userID = req.params.id
    try {
        const user = await prisma.user.findUnique({
            where:{
                id : userID
            }
        })

        if(!user){
            return res.status(404).json({
                message : "User not found"
            })
        }
        return res.status(200).json({
            user
        })
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            message : "Something up with our server"
        })
    }
})

userRouter.put("/:id", (req,res)=>{

})

userRouter.delete("/:id", async (req,res)=>{
    const userID = req.params.id
    try {
        const userToDelete = await prisma.user.delete({
            where:{
                id : userID
            }
        }) 


        return res.status(200).json({
            message : "User deleted"
        })

    } catch (error) {
        console.log(error)
        return res.status(404).json({
            message : "User not found"
        })
    }
})