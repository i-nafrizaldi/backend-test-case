"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const transaction_controller_1 = require("../../controllers/transaction.controller");
const returning_service_1 = require("../../services/transactions/returning.service");
jest.mock("../../services/transactions/returning.service");
const transactionController = new transaction_controller_1.TransactionController();
describe("Transaction Controller", () => {
    const app = new app_1.default().app;
    it("should successfully return books", () => __awaiter(void 0, void 0, void 0, function* () {
        const requestBody = {
            memberId: 1,
            bookCodes: ["abc", "def"],
        };
        returning_service_1.returningService.mockResolvedValue({
            message: "Transaction Success!",
        });
        const response = yield (0, supertest_1.default)(app)
            .post("/api/returning")
            .send(requestBody);
        expect(response.status).toBe(200);
        expect(response.text).toBe("Transaction Success!");
    }));
    it("should return error if returning service throws an error", () => __awaiter(void 0, void 0, void 0, function* () {
        const requestBody = {
            memberId: 1,
            bookCodes: ["abc"],
        };
        returning_service_1.returningService.mockRejectedValue(new Error("Borrowing record not found!"));
        const response = yield (0, supertest_1.default)(app)
            .post("/api/returning")
            .send(requestBody);
        expect(response.status).toBe(500);
        expect(response.text).toBe("Borrowing record not found!");
    }));
});
