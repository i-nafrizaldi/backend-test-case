"use strict";
// import { NextFunction, Request, Response } from "express";
// import { getBooksService } from "../services/books/getBooks.service";
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
exports.BookController = void 0;
const getBooks_service_1 = require("../services/books/getBooks.service");
/**
 * @swagger
 * /api/book:
 *   get:
 *     summary: Retrieve all books
 *     description: Get a list of all books in the library
 *     responses:
 *       200:
 *         description: List of books
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
 *                     example: "JK-45"
 *                   title:
 *                     type: string
 *                     example: "Harry Potter"
 *                   author:
 *                     type: string
 *                     example: "J.K Rowling"
 *                   stock:
 *                     type: integer
 *                     example: 1
 *                   isBorrowed:
 *                     type: boolean
 *                     example: false
 */
class BookController {
    getBookController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, getBooks_service_1.getBooksService)();
                return res.status(200).send(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.BookController = BookController;
