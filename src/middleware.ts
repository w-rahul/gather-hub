import { Request, Response, NextFunction } from "express"
import { verify } from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string

// Authentication middleware 

export const authenticate = (req : Request ,res: Response ,next: NextFunction) =>{
    try {
            
        const AuthHeader = Array.isArray(req.headers["authorization"]) ? req.headers["authorization"][0] : req.headers["authorization"] || ""; 

        if(!AuthHeader || !AuthHeader.startsWith("Bearer ")){
            return res.status(403).json({
                message : "Unauthorized: Missing or invalid authorization header"
            })
        }
        
        const token = AuthHeader.split(" ")[1]
        const decoded = verify(token, JWT_SECRET) as { id: string; role: 'ADMIN' | 'ORGANIZER' | 'VIEWER' };
        
        req.user = {
            id: decoded.id,
            role: decoded.role
        }
        next()

    } catch (error) {
        console.log(error)
        return res.status(403).json({
            message : "Unauthorized"
        })
    }
}

//VIEWER middleware 

export const authorizeVIEWER = (req: Request, res:Response, next:NextFunction) =>{
        try {
            if(req.user && req.user.role == "VIEWER") next()
                else{
                    return res.status(403).json({
                        message : "This action is for Viewers only"
                    })
                }
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message : "Something is up with our server right now!"
            })
        }
}


// Organizer Authorization middleware

export const authorizeOrganizer= (req: Request, res: Response , next: NextFunction) =>{
    try {

        if(req.user && req.user.role == "ORGANIZER"){
            next()
        }
        else{
            console.log(req.user?.role)
            return res.status(403).json({
                message : "You are not authorized to access this role",
                role : req.user?.role
            })
        }

    } catch (error) {
        console.log(error)
        return res.status(403).json({
            message : "You are not Authorized to acced this route"
        })
    }  
}

// Admin Authorization middleware

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) =>{
    try {

        if(req.user && req.user.role == "ADMIN"){
            next()
        }
        else{
            return res.status(403).json({
                message : "This route is for Admin access only "
            })
        }

    } catch (error) {
        console.log(error)
        return res.status(403).json({
            message : "Only Admin can access this route"
        })
    }
}