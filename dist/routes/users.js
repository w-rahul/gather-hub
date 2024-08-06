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
const prisma = new client_1.PrismaClient();
// const JWT_SECRET = process.env.JWT_SECRET as string
// dotenv.config();
exports.userRouter = express_1.default.Router();
exports.userRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.userRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.userRouter.put("/:id", (req, res) => {
});
exports.userRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userID = req.params.id;
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
