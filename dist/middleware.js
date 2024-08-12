"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAdmin = exports.authorizeOrganizer = exports.authorizeVIEWER = exports.authenticate = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
// Authentication middleware 
const authenticate = (req, res, next) => {
    try {
        const AuthHeader = Array.isArray(req.headers["authorization"]) ? req.headers["authorization"][0] : req.headers["authorization"] || "";
        if (!AuthHeader || !AuthHeader.startsWith("Bearer ")) {
            return res.status(403).json({
                message: "Unauthorized: Missing or invalid authorization header"
            });
        }
        const token = AuthHeader.split(" ")[1];
        const decoded = (0, jsonwebtoken_1.verify)(token, JWT_SECRET);
        req.user = {
            id: decoded.id,
            role: decoded.role
        };
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({
            message: "Unauthorized"
        });
    }
};
exports.authenticate = authenticate;
//VIEWER middleware 
const authorizeVIEWER = (req, res, next) => {
    try {
        if (req.user && req.user.role == "VIEWER")
            next();
        else {
            return res.status(403).json({
                message: "This action is for Viewers only"
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something is up with our server right now!"
        });
    }
};
exports.authorizeVIEWER = authorizeVIEWER;
// Organizer Authorization middleware
const authorizeOrganizer = (req, res, next) => {
    var _a, _b;
    try {
        if (req.user && req.user.role == "ORGANIZER") {
            next();
        }
        else {
            console.log((_a = req.user) === null || _a === void 0 ? void 0 : _a.role);
            return res.status(403).json({
                message: "You are not authorized to access this role",
                role: (_b = req.user) === null || _b === void 0 ? void 0 : _b.role
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({
            message: "You are not Authorized to acced this route"
        });
    }
};
exports.authorizeOrganizer = authorizeOrganizer;
// Admin Authorization middleware
const authorizeAdmin = (req, res, next) => {
    try {
        if (req.user && req.user.role == "ADMIN") {
            next();
        }
        else {
            return res.status(403).json({
                message: "This route is for Admin access only "
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({
            message: "Only Admin can access this route"
        });
    }
};
exports.authorizeAdmin = authorizeAdmin;
