import express, { Express, json, NextFunction, Request, Response, urlencoded } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { PORT } from "./config";
import { BookRouter } from "./routers/book.router";
import { MemberRouter } from "./routers/member.router";
import { TransactionRouter } from "./routers/transaction.router";
import { swaggerOptions } from "../swaggerOption";
  // Pastikan ini path yang benar

export default class App {
  readonly app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  private handleError(): void {
    // not found
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes("/api/")) {
        res.status(404).send("Not found !");
      } else {
        next();
      }
    });

    // error
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (req.path.includes("/api/")) {
          res.status(500).send(err.message);
        } else {
          next();
        }
      }
    );
  }

  private routes(): void {
    const bookRouter = new BookRouter();
    const memberRouter = new MemberRouter();
    const transactionRouter = new TransactionRouter();
    const swaggerSpec = swaggerJSDoc(swaggerOptions);

    this.app.get("/api", (req: Request, res: Response) => {
      res.send(`Hello, Welcome to Purwapora API !`);
    });

    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    this.app.use("/api/book", bookRouter.getRouter());
    this.app.use("/api/member", memberRouter.getRouter());
    this.app.use("/api", transactionRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
