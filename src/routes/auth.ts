import { PrismaClient } from "@prisma/client"
import express from "express"
import { sign } from "jsonwebtoken"
import z from "zod"
import dotenv from "dotenv"

export const authRouter = express.Router()

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET as string
dotenv.config();


// Register-route

const registerSchema = z.object({
    name : z.string(),
    email : z.string().email(),
    password : z.string().min(6),
    role: z.enum(["ORGANIZER","VIEWER"]).optional()
})

authRouter.post("/register", async (req,res)=>{
    const body = req.body
    const payload = registerSchema.safeParse(body)

    if(!payload.success){
        console.log(payload.error.errors)
        return res.status(411).json({
            message : "Invalid inputs"
        })
    }

    const userExist = await prisma.user.findUnique({
        where:{
            email : body.email
        }
    })

    if(userExist){
        return res.status(409).json({
            mssg : "Email already in use"
        })
    }

try {
    const user = await prisma.user.create({
        data:{
            name : body.name,
            email : body.email,
            password : body.password,
            role : body.role
        }
    })

    const token = sign({id : user.id, role: user.role}, JWT_SECRET)
    return res.status(200).json({
        message : "User Created successfuly",
        token
    })
    }   
catch (error) {
    console.error(error); 
    return res.status(500).json({
        message : "Error while signing up"
    })    
    }

})

// Login-route

const loginSchema =  z.object({
    email : z.string().email(),
    password : z.string()
})

authRouter.post("/login", async (req,res)=>{
    const body =  req.body

    const {success} = loginSchema.safeParse(body)
    if(!success){
        return res.status(411).json({
            message : "Invalid inputs"
        })
    }

    const userExist = await prisma.user.findUnique({
        where:{
            email : body.email,
            password : body.password
        }
    })

    if(!userExist){
        return res.status(411).json({
            message : "User not found / incorrect password"
        })
    }
try {
    
    const token = sign({id: userExist.id, role: userExist.role}, JWT_SECRET)
    return res.status(200).json({
        token
    })

} catch (error) {
    console.error(error)
    return res.status(500).json({
        message : "Something is up with the server"
    })   
}

})
