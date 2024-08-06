"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
exports.authRouter = (0, express_1.default)();
exports.authRouter.post("/register", (req, res) => {
    res.send({
        mssg: "Hello from register"
    });
});
exports.authRouter.post("/login", (req, res) => {
    res.send({
        mssg: "Hello from login"
    });
});
exports.authRouter.get("/logout", (req, res) => {
    res.send({
        mssg: "Auth router is working fine"
    });
});
