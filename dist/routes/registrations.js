"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrationsRtouer = void 0;
const express_1 = __importDefault(require("express"));
exports.registrationsRtouer = express_1.default.Router();
// Admin only 
exports.registrationsRtouer.get("/", (req, res) => {
});
exports.registrationsRtouer.post("/", (req, res) => {
});
exports.registrationsRtouer.get("/:id", (req, res) => {
});
exports.registrationsRtouer.delete("/:id", (req, res) => {
});
