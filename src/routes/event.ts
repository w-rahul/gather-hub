import express from "express"
import { authenticate, authorizeOrganizer } from "../middleware"
import { date, z } from "zod"
import { PrismaClient } from "@prisma/client"
// import moment from 'moment-timezone';

export const eventRouter = express.Router()

const prisma = new PrismaClient()

const EventCreationSchema = z.object({
    title: z.string(),
    description: z.string().min(10),
    date: z.string(),
    time: z.string(),
    location: z.string(),
    category: z.string()
})

eventRouter.post("/",authenticate, authorizeOrganizer, async (req,res)=>{
    const body = req.body
    const UserIdFromToken = req.user?.id as string

try {

    const payload = EventCreationSchema.safeParse(body)
        if(!payload.success){
            console.error(payload.error.errors)
            return res.status(400).json({
                message : "Invalid Inputs"
            })
        }

        // const heredate = moment.utc(body.date).tz('Asia/Kolkata').format('YYYY-MM-DD'); 
        // const heretime = moment.utc(body.time).tz('Asia/Kolkata').format('HH:mm:ss');

        // const heredateTime = moment.tz(`${body.date} ${body.time}`, 'Asia/Kolkata').toISOString()

    const event = await prisma.event.findFirst({
        where:{
            id : body.id,
            title: body.title,
        }
    })

    if(event){
        return res.status(409).json({
            message : "Event already exists!"
        })
    }

    await prisma.event.create({
        data:{
            title: body.title,
            description: body.description,
            date: new Date(body.date),
            time: new Date(body.time),
            location: body.location,
            category: body.category,
            organizerId : UserIdFromToken
        }
    })

    return res.status(200).json({
        message : "Event created successfuly"
    })

} catch (error) {
    console.log(error)
    return res.status(500).json({
        message : "Something is up with our server"
    })
}

    

})

eventRouter.get("/", authenticate, (req,res)=>{
    
})

eventRouter.get("/:id", (req,res)=>{

})

eventRouter.put("/:id", (req,res)=>{

})

eventRouter.delete("/:id", (req,res)=>{

})
