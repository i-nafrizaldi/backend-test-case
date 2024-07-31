"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRouter = void 0;
const express_1 = require("express");
const transaction_controller_1 = require("../controllers/transaction.controller");
class TransactionRouter {
    constructor() {
        this.transactionController = new transaction_controller_1.TransactionController();
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/borrowing", this.transactionController.createTransaction);
        this.router.post("/returning", this.transactionController.returningBook);
    }
    getRouter() {
        return this.router;
    }
}
exports.TransactionRouter = TransactionRouter;
