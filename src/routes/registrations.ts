import express from "express"
import { authenticate } from "../middleware"
import { PrismaClient } from "@prisma/client"

export const registrationsRtouer = express.Router()

const prisma = new PrismaClient

registrationsRtouer.post("/:id",authenticate, async (req,res)=>{

try {
    const UserIDfromToken = req.user?.id as string
    const EventIDfromParams = req.params.id

    const eventExists = await prisma.event.findUnique({
        where:{
            id : EventIDfromParams
        }
    })

    if(!eventExists){
        return res.status(404).json({
            message: "Event not found"
        })
    }

     const ExistRegistration = await prisma.registrations.findUnique({
        where:{
            userID : UserIDfromToken,
            eventID : EventIDfromParams
        }
    })

    if(ExistRegistration){
        return res.status(409).json({
            message: "User already registered for this event",
        });
    }

    const Registration = await prisma.registrations.create({
        data:{
            userID : UserIDfromToken,
            eventID : EventIDfromParams
        }
    })
    return res.status(200).json({
        message: `User ${UserIDfromToken} is register for ${EventIDfromParams} event`
    })
} catch (error) {
    console.log(error)
    return res.status(500).json({
        message : "Something went wrong during registration"
    })
}
    
})

// Admin only 
registrationsRtouer.get("/", (req,res)=>{

})


registrationsRtouer.get("/:id", (req,res)=>{

})

registrationsRtouer.delete("/:id", (req,res)=>{

})

