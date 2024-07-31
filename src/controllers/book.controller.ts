import { NextFunction, Request, Response } from "express";
import { getBooksService } from "../services/books/getBooks.service";

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
export class BookController {
  async getBookController(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getBooksService();
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
