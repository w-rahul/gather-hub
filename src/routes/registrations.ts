import express from "express"
import { authenticate, authorizeAdmin, authorizeVIEWER } from "../middleware"
import { PrismaClient } from "@prisma/client"

export const registrationsRtouer = express.Router()

const prisma = new PrismaClient

//! Need testing

// Registraion POST-id route
registrationsRtouer.post("/:id", authenticate,authorizeVIEWER, async (req,res)=>{

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
            userID_eventID: {
                userID :UserIDfromToken,
                eventID : EventIDfromParams
            }
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
//  Registraion GET route 
registrationsRtouer.get("/",authenticate, authorizeAdmin, async (req,res)=>{

    try {
        const Registrations = await prisma.registrations.findMany({})
    if(!Registrations){
        return res.status(404).json({
            message : "No registration found"
        })
    }

    return res.status(200).json({
        Registrations
    })    
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message : "Something is up with our server"
      })  
    }
    
})


// Registraion GET-id route
registrationsRtouer.get("/:eventID/:userID", authenticate, async (req, res) => {
    try {
        const { eventID, userID } = req.params;

        const SpecificRegistration = await prisma.registrations.findUnique({
            where: {
                userID_eventID: {
                    userID : userID,
                    eventID : eventID
                }                
            }
        });

        if (SpecificRegistration) {
            return res.status(200).json({
                registered: true
            });
        }

        return res.status(200).json({
            registered: false
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something is up with our server"
        });
    }
});



// Registraion DELETE-id route
registrationsRtouer.delete("/:id", authenticate,authorizeVIEWER, async (req,res)=>{
    
    const EventIDParams :string  = req.params.id 
    const UserIDfromToken = req.user?.id as string

try {
    const eventExists = await prisma.event.findUnique({
        where:{
            id : EventIDParams
        }
    })

    if(eventExists){
        return res.status(404).json({
            message : "Event not found"
        })
    }

    await prisma.registrations.delete({
        where:{
            userID_eventID: {
                userID :UserIDfromToken,
                eventID : EventIDParams
            }
        }
    })

    return res.status(200).json({
        message : `Registration of ${UserIDfromToken} is successfully deleted for event ${EventIDParams}`
    })

} catch (error) {
    console.log(error)
    return res.status(500).json({
        message : "Something is up with our server"
    })
}
})

