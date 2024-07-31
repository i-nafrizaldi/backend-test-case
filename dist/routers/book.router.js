"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookRouter = void 0;
const express_1 = require("express");
const book_controller_1 = require("../controllers/book.controller");
class BookRouter {
    constructor() {
        this.bookController = new book_controller_1.BookController();
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/", this.bookController.getBookController);
    }
    getRouter() {
        return this.router;
    }
}
exports.BookRouter = BookRouter;
