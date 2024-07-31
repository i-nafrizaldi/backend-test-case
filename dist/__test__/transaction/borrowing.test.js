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
const prisma_1 = require("../prisma");
const requestBody = {
    memberId: 1,
    bookCodes: ["abc", "def"],
};
describe("Transaction Controller", () => {
    const app = new app_1.default().app;
    it("should transaction successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.prismaMock.member.findFirst.mockResolvedValueOnce({
            id: 1,
            code: "M001",
            name: "John Doe",
            isPenalty: false,
        });
        prisma_1.prismaMock.borrowing.count.mockResolvedValueOnce(1);
        prisma_1.prismaMock.book.findMany.mockResolvedValueOnce([
            {
                code: "abc",
                stock: 1,
                title: "Book ABC",
                id: 1,
                author: "",
                isBorrowed: false,
            },
            {
                code: "def",
                stock: 1,
                title: "Book DEF",
                id: 1,
                author: "",
                isBorrowed: false,
            },
        ]);
        const response = yield (0, supertest_1.default)(app)
            .post("/api/borrowing")
            .send(requestBody);
        expect(response.status).toBe(200);
        expect(response.text).toBe("Transaction Success!");
    }));
    it("should return error if member not found", () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.prismaMock.member.findFirst.mockResolvedValueOnce(null);
        const response = yield (0, supertest_1.default)(app)
            .post("/api/borrowing")
            .send(requestBody);
        expect(response.status).toBe(500);
        expect(response.text).toBe("Member not found!");
    }));
    it("should return error if member is penalized", () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.prismaMock.member.findFirst.mockResolvedValueOnce({
            id: 1,
            code: "M001",
            name: "John Doe",
            isPenalty: true,
        });
        const response = yield (0, supertest_1.default)(app)
            .post("/api/borrowing")
            .send(requestBody);
        expect(response.status).toBe(500);
        expect(response.text).toBe("Member is currently penalized!");
    }));
    it("should return error if member has already borrowed 2 books", () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.prismaMock.member.findFirst.mockResolvedValueOnce({
            id: 1,
            code: "M001",
            name: "John Doe",
            isPenalty: false,
        });
        prisma_1.prismaMock.borrowing.count.mockResolvedValueOnce(2);
        const response = yield (0, supertest_1.default)(app)
            .post("/api/borrowing")
            .send(requestBody);
        expect(response.status).toBe(500);
        expect(response.text).toBe("Member cannot borrow more than 2 books!");
    }));
    it("should return error if one or more books not found", () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.prismaMock.member.findFirst.mockResolvedValueOnce({
            id: 1,
            code: "M001",
            name: "John Doe",
            isPenalty: false,
        });
        prisma_1.prismaMock.borrowing.count.mockResolvedValueOnce(1);
        prisma_1.prismaMock.book.findMany.mockResolvedValueOnce([
            {
                code: "abc",
                stock: 1,
                title: "Book ABC",
                id: 0,
                author: "",
                isBorrowed: false,
            },
        ]);
        const response = yield (0, supertest_1.default)(app)
            .post("/api/borrowing")
            .send(requestBody);
        expect(response.status).toBe(500);
        expect(response.text).toBe("One or more books not found!");
    }));
    it("should return error if book is out of stock", () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.prismaMock.member.findFirst.mockResolvedValueOnce({
            id: 1,
            code: "M001",
            name: "John Doe",
            isPenalty: false,
        });
        prisma_1.prismaMock.borrowing.count.mockResolvedValueOnce(1);
        prisma_1.prismaMock.book.findMany.mockResolvedValueOnce([
            {
                code: "abc",
                stock: 0,
                title: "Book ABC",
                id: 0,
                author: "",
                isBorrowed: false,
            },
            {
                code: "def",
                stock: 1,
                title: "Book DEF",
                id: 0,
                author: "",
                isBorrowed: false,
            },
        ]);
        const response = yield (0, supertest_1.default)(app)
            .post("/api/borrowing")
            .send(requestBody);
        expect(response.status).toBe(500);
        expect(response.text).toBe("Book Book ABC is out of stock!");
    }));
});
