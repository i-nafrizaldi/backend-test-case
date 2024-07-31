import { Router } from "express";
import { BookController } from "../controllers/book.controller";

export class BookRouter {
  private router: Router;
  private bookController: BookController;

  constructor() {
    this.bookController = new BookController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/", this.bookController.getBookController);
  }

  getRouter(): Router {
    return this.router;
  }
}
