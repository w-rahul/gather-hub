"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventRouter = void 0;
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
// import moment from 'moment-timezone';
exports.eventRouter = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// Event POST route
const EventCreationSchema = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string().min(10),
    date: zod_1.z.string(),
    location: zod_1.z.string(),
    category: zod_1.z.string()
});
exports.eventRouter.post("/", middleware_1.authenticate, middleware_1.authorizeOrganizer, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const body = req.body;
    const UserIdFromToken = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const payload = EventCreationSchema.safeParse(body);
        if (!payload.success) {
            console.error(payload.error.errors);
            return res.status(400).json({
                message: "Invalid Inputs"
            });
        }
        // const heredate = moment.utc(body.date).tz('Asia/Kolkata').format('YYYY-MM-DD'); 
        // const heretime = moment.utc(body.time).tz('Asia/Kolkata').format('HH:mm:ss');
        // const heredateTime = moment.tz(`${body.date} ${body.time}`, 'Asia/Kolkata').toISOString()
        const event = yield prisma.event.findFirst({
            where: {
                id: body.id,
                title: body.title,
            }
        });
        if (event) {
            return res.status(409).json({
                message: "Event already exists!"
            });
        }
        const NewEvent = yield prisma.event.create({
            data: {
                title: body.title,
                description: body.description,
                date: new Date(body.date),
                location: body.location,
                category: body.category,
                organizerId: UserIdFromToken
            }
        });
        return res.status(200).json({
            id: NewEvent.id,
            message: "Event created successfuly"
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something is up with our server"
        });
    }
}));
// Event GET route
exports.eventRouter.get("/", middleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const AllEvents = yield prisma.event.findMany({
            select: {
                id: true,
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
                registrations: {
                    select: {
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });
        return res.status(200).json({
            AllEvents
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something is up with our server"
        });
    }
}));
// Event GET-id route
exports.eventRouter.get("/:id", middleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const EventID = req.params.id;
        const SpecificEvent = yield prisma.event.findUnique({
            where: {
                id: EventID
            },
            select: {
                id: true,
                title: true,
                description: true,
                date: true,
                category: true,
                location: true,
                organizerId: true,
                organizer: {
                    select: {
                        name: true,
                    },
                },
                registrations: {
                    select: {
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });
        return res.status(200).json({
            SpecificEvent
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something is up with our server"
        });
    }
}));
// Event PUT route
const EventUpdateSchema = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string().min(10),
    date: zod_1.z.string(),
    time: zod_1.z.string(),
    location: zod_1.z.string(),
    category: zod_1.z.string()
});
exports.eventRouter.put("/:id", middleware_1.authenticate, middleware_1.authorizeOrganizer, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const ParamID = req.params.id;
        const body = req.body;
        const UserIdFromToken = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const Payload = EventUpdateSchema.safeParse(body);
        if (!Payload.success) {
            console.error(Payload.error.errors);
            return res.status(400).json({
                message: "Invalid inputs"
            });
        }
        const Event = yield prisma.event.findUnique({
            where: {
                id: ParamID
            }
        });
        if (!Event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }
        const UpdatedEvent = yield prisma.event.update({
            where: {
                id: ParamID
            },
            data: {
                title: body.title,
                description: body.description,
                date: new Date(body.date),
                location: body.location,
                category: body.category,
                organizerId: UserIdFromToken
            }
        });
        return res.status(200).json({
            message: "Event updated successfully",
            UpdatedEvent
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something is up with our server"
        });
    }
}));
// Event DELETE route
exports.eventRouter.delete("/:id", middleware_1.authenticate, middleware_1.authorizeOrganizer, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const EventID = req.params.id;
        const UserIdFromToken = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const event = yield prisma.event.findUnique({
            where: {
                id: EventID
            },
            select: {
                organizerId: true
            }
        });
        if (!event) {
            return res.send(404).json({
                message: "Event not found"
            });
        }
        if (event.organizerId !== UserIdFromToken) {
            console.log("Error - Forbidden");
            return res.status(403).json({
                message: "Forbidden: You can only delete your own events"
            });
        }
        yield prisma.event.delete({
            where: {
                id: EventID
            }
        });
        return res.status(200).json({
            message: "Event deleted"
        });
    }
    catch (error) {
        return res.status(403).json({
            message: "Something is up with our server"
        });
    }
}));
