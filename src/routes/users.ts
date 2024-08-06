import express from "express"
import { PrismaClient } from "@prisma/client"
import dotenv from "dotenv"
import { z } from "zod"

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

const UserUpdateSchema = z.object({
    name: z.string().optional(),
    email : z.string().email().optional(),
    password : z.string().min(6).optional(),
    role : z.enum(["ORGANIZER", "VIEWER"]).optional()
})

userRouter.put("/:id", async (req,res)=>{
    const body = req.body
    const userID = req.params.id
    const success = UserUpdateSchema.safeParse(body)
    if(!success.success){
        console.log(success.error.errors)
        return res.status(411).json({
            message : "Invalid inputs"
        })
    }
try {
    const updatedUser = await prisma.user.update({
        where:{
            id : userID
        },
        data:{
            name : body.name,
            email : body.email,
            password : body.password,
            role : body.role,
        }
    })

    return res.status(200).json({
        message: 'User updated successfully',
        user: updatedUser,
    })
} catch (error) {
    console.log(error)
    return res.status(500).json({
        message : "Error updating user"
    })
}
      
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