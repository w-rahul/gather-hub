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
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const middleware_1 = require("../middleware");
const prisma = new client_1.PrismaClient();
// const JWT_SECRET = process.env.JWT_SECRET as string
// dotenv.config();
exports.userRouter = express_1.default.Router();
// User GET route
exports.userRouter.get("/", middleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.findMany({});
        res.status(200).json({
            user
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}));
// User GET-id route
exports.userRouter.get("/:id", middleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userID = req.params.id;
    try {
        const user = yield prisma.user.findUnique({
            where: {
                id: userID
            }
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        return res.status(200).json({
            user
        });
    }
    catch (error) {
        console.log(error);
        return res.status(404).json({
            message: "Something up with our server"
        });
    }
}));
// User PUT route
const UserUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    password: zod_1.z.string().min(6).optional(),
    role: zod_1.z.enum(["ORGANIZER", "VIEWER"]).optional()
});
exports.userRouter.put("/:id", middleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const body = req.body;
    const userID = req.params.id;
    const UserIdFromToken = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (userID !== UserIdFromToken) {
        return res.status(403).json({
            message: "You are not allow to alter another user's detailes"
        });
    }
    const success = UserUpdateSchema.safeParse(body);
    if (!success.success) {
        console.log(success.error.errors);
        return res.status(411).json({
            message: "Invalid inputs"
        });
    }
    try {
        const updatedUser = yield prisma.user.update({
            where: {
                id: userID
            },
            data: {
                name: body.name,
                email: body.email,
                password: body.password,
                role: body.role,
            }
        });
        return res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error updating user"
        });
    }
}));
// User DELETE route
exports.userRouter.delete("/:id", middleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userID = req.params.id;
    const UserIdFromToken = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (userID !== UserIdFromToken) {
        return res.status(403).json({
            message: "You are not allow to alter another user's detailes"
        });
    }
    try {
        const userToDelete = yield prisma.user.delete({
            where: {
                id: userID
            }
        });
        return res.status(200).json({
            message: "User deleted"
        });
    }
    catch (error) {
        console.log(error);
        return res.status(404).json({
            message: "User not found"
        });
    }
}));
