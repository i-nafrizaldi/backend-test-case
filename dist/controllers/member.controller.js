"use strict";
// import { NextFunction, Request, Response } from "express";
// import { getMembersService } from "../services/members/getMembers.service";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberController = void 0;
const getMembers_service_1 = require("../services/members/getMembers.service");
/**
 * @swagger
 * /api/member:
 *   get:
 *     summary: Retrieve all members
 *     description: Get a list of all members in the library
 *     responses:
 *       200:
 *         description: List of members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   code:
 *                     type: string
 *                     example: "M001"
 *                   name:
 *                     type: string
 *                     example: "Angga"
 *                   isPenalty:
 *                     type: boolean
 *                     example: false
 */
class MemberController {
    getMemberController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, getMembers_service_1.getMembersService)();
                return res.status(200).send(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.MemberController = MemberController;
