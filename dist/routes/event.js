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
exports.eventRouter = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const EventCreationSchema = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string().min(10),
    date: zod_1.z.string(),
    time: zod_1.z.string(),
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
        yield prisma.event.create({
            data: {
                title: body.title,
                description: body.description,
                date: new Date(body.date),
                time: new Date(body.time),
                location: body.location,
                category: body.category,
                organizerId: UserIdFromToken
            }
        });
        return res.status(200).json({
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
exports.eventRouter.get("/", middleware_1.authenticate, (req, res) => {
});
exports.eventRouter.get("/:id", (req, res) => {
});
exports.eventRouter.put("/:id", (req, res) => {
});
exports.eventRouter.delete("/:id", (req, res) => {
});
