import express from "express"
import { authenticate, authorizeOrganizer } from "../middleware"
import { date, z } from "zod"
import { PrismaClient } from "@prisma/client"
// import moment from 'moment-timezone';

export const eventRouter = express.Router()

const prisma = new PrismaClient()


// Event POST route

const EventCreationSchema = z.object({
    title: z.string(),
    description: z.string().min(10),
    date: z.string(),
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

// Event GET route
eventRouter.get("/", authenticate, async (req,res)=>{

try {
    const AllEvents = await prisma.event.findMany({
        select: {
            title: true,
            description: true,
            date: true,
            category: true,
            location: true,
            organizer: {
                select: {
                    name: true,
                },
            },
            registrations:{
                select: {
                    user :{
                        select:{
                            name: true
                        }
                    }
                }
            }   
        }
    })
    return res.status(200).json({
        AllEvents
    })
} catch (error) {
    console.log(error)
    return res.status(500).json({
        message : "Something is up with our server"
    })
}    
    
})

// Event GET-id route
eventRouter.get("/:id", authenticate, async (req,res)=>{

try {
    const EventID = req.params.id
    const SpecificEvent = await prisma.event.findUnique({
        where:{
            id : EventID
        }
    })

    return res.status(200).json({
        SpecificEvent
    })
} catch (error) {
    console.log(error)
    return res.status(500).json({
        message : "Something is up with our server"
    })
}    
    
})

// Event PUT route
const EventUpdateSchema = z.object({
    title: z.string(),
    description: z.string().min(10),
    date: z.string(),
    time: z.string(),
    location: z.string(),
    category: z.string()
})

eventRouter.put("/:id",authenticate, authorizeOrganizer, async (req,res)=>{
    
try {
    const ParamID = req.params.id
    const body = req.body
    const UserIdFromToken = req.user?.id as string

    const Payload = EventUpdateSchema.safeParse(body)
    if(!Payload.success){
        console.error(Payload.error.errors)
        return res.status(400).json({
            message : "Invalid inputs"
        })
    }

    const Event = await prisma.event.findUnique({
        where:{
            id : ParamID
        }
    })

    if(!Event){
        return res.status(404).json({
            message : "Event not found"
        })
    }

    const UpdatedEvent = await prisma.event.update({
        where:{
            id: ParamID
        },
        data:{
            title: body.title,
            description: body.description,
            date: new Date(body.date),
            location: body.location,
            category: body.category,
            organizerId : UserIdFromToken
        }
    })  

    return res.status(200).json({
        message : "Event updated successfully",
        UpdatedEvent
    })

} catch (error) {
    console.log(error)
    return res.status(500).json({
        message : "Something is up with our server"
    })
}    
    
})

// Event DELETE route
eventRouter.delete("/:id", async (req,res)=>{
 
try {
    const EventID = req.params.id

    await prisma.event.delete({
        where:{
            id : EventID
        }
    })

    return res.status(200).json({
        message : "Event deleted"
    })
} catch (error) {
    console.log(error)
    return res.status(500).json({
        message : "Something is up with our server"
    })
}    
    
})
