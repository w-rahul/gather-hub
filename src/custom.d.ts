import { Request } from "express";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: 'ADMIN' | 'ORGANIZER' | 'VIEWER';
            };
        }
    }
}
