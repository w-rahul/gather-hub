"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventRouter = void 0;
const express_1 = __importDefault(require("express"));
exports.eventRouter = express_1.default.Router();
exports.eventRouter.get("/", (req, res) => {
});
exports.eventRouter.post("/", (req, res) => {
});
exports.eventRouter.get("/:id", (req, res) => {
});
exports.eventRouter.put("/:id", (req, res) => {
});
exports.eventRouter.delete("/:id", (req, res) => {
});
