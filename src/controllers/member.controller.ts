import { NextFunction, Request, Response } from "express";
import { getMembersService } from "../services/members/getMembers.service";

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
export class MemberController {
  async getMemberController(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getMembersService();
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
