import { Router } from "express";
import { MemberController } from "../controllers/member.controller";
import { TransactionController } from "../controllers/transaction.controller";

export class TransactionRouter {
  private router: Router;
  private transactionController: TransactionController;

  constructor() {
    this.transactionController = new TransactionController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/borrowing", this.transactionController.createTransaction);
    this.router.post("/returning", this.transactionController.returningBook);
  }

  getRouter(): Router {
    return this.router;
  }
}
