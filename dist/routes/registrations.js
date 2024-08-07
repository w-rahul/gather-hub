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
exports.registrationsRtouer = void 0;
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const client_1 = require("@prisma/client");
exports.registrationsRtouer = express_1.default.Router();
const prisma = new client_1.PrismaClient;
exports.registrationsRtouer.post("/:id", middleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const UserIDfromToken = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const EventIDfromParams = req.params.id;
        const eventExists = yield prisma.event.findUnique({
            where: {
                id: EventIDfromParams
            }
        });
        if (!eventExists) {
            return res.status(404).json({
                message: "Event not found"
            });
        }
        const ExistRegistration = yield prisma.registrations.findUnique({
            where: {
                userID: UserIDfromToken,
                eventID: EventIDfromParams
            }
        });
        if (ExistRegistration) {
            return res.status(409).json({
                message: "User already registered for this event",
            });
        }
        const Registration = yield prisma.registrations.create({
            data: {
                userID: UserIDfromToken,
                eventID: EventIDfromParams
            }
        });
        return res.status(200).json({
            message: `User ${UserIDfromToken} is register for ${EventIDfromParams} event`
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong during registration"
        });
    }
}));
// Admin only 
exports.registrationsRtouer.get("/", (req, res) => {
});
exports.registrationsRtouer.get("/:id", (req, res) => {
});
exports.registrationsRtouer.delete("/:id", (req, res) => {
});
