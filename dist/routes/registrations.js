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
//! Need testing
// Registraion POST-id route
exports.registrationsRtouer.post("/:id", middleware_1.authenticate, middleware_1.authorizeVIEWER, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                userID_eventID: {
                    userID: UserIDfromToken,
                    eventID: EventIDfromParams
                }
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
//  Registraion GET route 
exports.registrationsRtouer.get("/:id", middleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const EventID = req.params.id;
    try {
        const Registrations = yield prisma.registrations.findMany({
            where: {
                eventID: EventID
            },
            select: {
                user: {
                    select: {
                        name: true
                    }
                }
            }
        });
        if (!Registrations) {
            return res.status(404).json({
                message: "No registration found"
            });
        }
        return res.status(200).json({
            Registrations
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something is up with our server"
        });
    }
}));
// Registraion GET-id route
exports.registrationsRtouer.get("/:eventID/:userID", middleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventID, userID } = req.params;
        const SpecificRegistration = yield prisma.registrations.findUnique({
            where: {
                userID_eventID: {
                    userID: userID,
                    eventID: eventID
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
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something is up with our server"
        });
    }
}));
// Registraion DELETE-id route
exports.registrationsRtouer.delete("/:id", middleware_1.authenticate, middleware_1.authorizeVIEWER, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const EventIDParams = req.params.id;
    const UserIDfromToken = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const eventExists = yield prisma.event.findUnique({
            where: {
                id: EventIDParams
            }
        });
        if (eventExists) {
            return res.status(404).json({
                message: "Event not found"
            });
        }
        yield prisma.registrations.delete({
            where: {
                userID_eventID: {
                    userID: UserIDfromToken,
                    eventID: EventIDParams
                }
            }
        });
        return res.status(200).json({
            message: `Registration of ${UserIDfromToken} is successfully deleted for event ${EventIDParams}`
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something is up with our server"
        });
    }
}));
