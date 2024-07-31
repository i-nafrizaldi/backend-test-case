"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const config_1 = require("./config");
const book_router_1 = require("./routers/book.router");
const member_router_1 = require("./routers/member.router");
const transaction_router_1 = require("./routers/transaction.router");
const swaggerOption_1 = __importDefault(require("./swaggerOption"));
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.configure();
        this.routes();
        this.handleError();
    }
    configure() {
        this.app.use((0, express_1.json)());
        this.app.use((0, express_1.urlencoded)({ extended: true }));
    }
    handleError() {
        // not found
        this.app.use((req, res, next) => {
            if (req.path.includes("/api/")) {
                res.status(404).send("Not found !");
            }
            else {
                next();
            }
        });
        // error
        this.app.use((err, req, res, next) => {
            if (req.path.includes("/api/")) {
                res.status(500).send(err.message);
            }
            else {
                next();
            }
        });
    }
    routes() {
        const bookRouter = new book_router_1.BookRouter();
        const memberRouter = new member_router_1.MemberRouter();
        const transactionRouter = new transaction_router_1.TransactionRouter();
        const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOption_1.default);
        this.app.get("/api", (req, res) => {
            res.send(`Hello, Welcome to Purwapora API !`);
        });
        this.app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
        this.app.use("/api/book", bookRouter.getRouter());
        this.app.use("/api/member", memberRouter.getRouter());
        this.app.use("/api", transactionRouter.getRouter());
    }
    start() {
        this.app.listen(config_1.PORT, () => {
            console.log(`  ➜  [API] Local:   http://localhost:${config_1.PORT}/`);
        });
    }
}
exports.default = App;
