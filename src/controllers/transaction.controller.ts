import { NextFunction, Request, Response } from "express";
import { borrowingService } from "../services/transactions/borrowing.service";
import { returningService } from "../services/transactions/returning.service";

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
export class TransactionController {
  async createTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await borrowingService(req.body);
      return res.status(200).send(result.message);
    } catch (error) {
      next(error);
    }
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
  async returningBook(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await returningService(req.body);
      return res.status(200).send(result.message);
    } catch (error) {
      next(error);
    }
  }
}
