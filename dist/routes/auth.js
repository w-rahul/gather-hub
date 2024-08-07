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
exports.authRouter = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = require("jsonwebtoken");
const zod_1 = __importDefault(require("zod"));
const dotenv_1 = __importDefault(require("dotenv"));
exports.authRouter = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
dotenv_1.default.config();
// Auth Register-route
const registerSchema = zod_1.default.object({
    name: zod_1.default.string(),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6),
    role: zod_1.default.enum(["ORGANIZER", "VIEWER"]).optional()
});
exports.authRouter.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const payload = registerSchema.safeParse(body);
    if (!payload.success) {
        console.log(payload.error.errors);
        return res.status(411).json({
            message: "Invalid inputs"
        });
    }
    const userExist = yield prisma.user.findUnique({
        where: {
            email: body.email
        }
    });
    if (userExist) {
        return res.status(409).json({
            mssg: "Email already in use"
        });
    }
    try {
        const user = yield prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: body.password,
                role: body.role
            }
        });
        const token = (0, jsonwebtoken_1.sign)({ id: user.id, role: user.role }, JWT_SECRET);
        return res.status(200).json({
            message: "User Created successfuly",
            token
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error while signing up"
        });
    }
}));
// Auth Login-route
const loginSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string()
});
exports.authRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { success } = loginSchema.safeParse(body);
    if (!success) {
        return res.status(411).json({
            message: "Invalid inputs"
        });
    }
    const userExist = yield prisma.user.findUnique({
        where: {
            email: body.email,
            password: body.password
        }
    });
    if (!userExist) {
        return res.status(411).json({
            message: "User not found / incorrect password"
        });
    }
    try {
        const token = (0, jsonwebtoken_1.sign)({ id: userExist.id, role: userExist.role }, JWT_SECRET);
        return res.status(200).json({
            token
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something is up with the server"
        });
    }
}));
