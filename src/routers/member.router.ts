import { Router } from "express";
import { MemberController } from "../controllers/member.controller";

export class MemberRouter {
  private router: Router;
  private memberController: MemberController;

  constructor() {
    this.memberController = new MemberController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/", this.memberController.getMemberController);
  }

  getRouter(): Router {
    return this.router;
  }
}
