"use strict";
// import { NextFunction, Request, Response } from "express";
// import { borrowingService } from "../services/transactions/borrowing.service";
// import { returningService } from "../services/transactions/returning.service";
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
exports.TransactionController = void 0;
const borrowing_service_1 = require("../services/transactions/borrowing.service");
const returning_service_1 = require("../services/transactions/returning.service");
/**
 * @swagger
 * /api/borrowing:
 *   post:
 *     summary: Borrow books
 *     description: Allows a member to borrow books
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               memberId:
 *                 type: integer
 *                 example: 1
 *               bookCodes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["JK-45", "SHR-1"]
 *     responses:
 *       200:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Transaction Success!"
 */
class TransactionController {
    createTransaction(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, borrowing_service_1.borrowingService)(req.body);
                return res.status(200).send(result.message);
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * @swagger
     * /api/returning:
     *   post:
     *     summary: Return books
     *     description: Allows a member to return borrowed books
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               memberId:
     *                 type: integer
     *                 example: 1
     *               bookCodes:
     *                 type: array
     *                 items:
     *                   type: string
     *                 example: ["JK-45"]
     *     responses:
     *       200:
     *         description: Success message
     *         content:
     *           application/json:
     *             schema:
     *               type: string
     *               example: "Transaction Success!"
     */
    returningBook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, returning_service_1.returningService)(req.body);
                return res.status(200).send(result.message);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.TransactionController = TransactionController;
