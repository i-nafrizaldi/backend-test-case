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
Object.defineProperty(exports, "__esModule", { value: true });
// src/__test__/services/returning.service.test.ts
const returning_service_1 = require("../../services/transactions/returning.service");
jest.mock("@prisma/client", () => {
    const mPrismaClient = {
        $transaction: jest.fn(),
        borrowing: {
            findFirst: jest.fn(),
            update: jest.fn(),
        },
        member: {
            update: jest.fn(),
        },
        book: {
            update: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});
jest.mock("node-schedule");
const mockTx = jest.fn();
describe("Returning Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should successfully process book returns", () => __awaiter(void 0, void 0, void 0, function* () {
        const requestBody = {
            memberId: 1,
            bookCodes: ["abc", "def"],
        };
        mockTx.mockImplementation((callback) => __awaiter(void 0, void 0, void 0, function* () {
            yield callback({
                borrowing: {
                    findFirst: jest
                        .fn()
                        .mockResolvedValueOnce({
                        id: 1,
                        borrowedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                    }) // 3 days ago
                        .mockResolvedValueOnce({
                        id: 2,
                        borrowedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
                    }), // 6 days ago
                    update: jest.fn().mockResolvedValue({ returnedAt: new Date() }),
                },
                member: {
                    update: jest.fn(),
                },
                book: {
                    update: jest.fn(),
                },
            });
            yield (0, returning_service_1.returningService)(requestBody);
        }));
        const result = yield (0, returning_service_1.returningService)(requestBody);
        expect(result.message).toBe("Transaction Success!");
        // expect(mockTx).toHaveBeenCalledTimes(1);
    }));
    it("should throw error if borrowing record not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const requestBody = {
            memberId: 1,
            bookCodes: ["abc"],
        };
        mockTx.mockImplementation((callback) => __awaiter(void 0, void 0, void 0, function* () {
            yield callback({
                borrowing: {
                    findFirst: jest.fn().mockResolvedValueOnce(null),
                    update: jest.fn(),
                },
                member: {
                    update: jest.fn(),
                },
                book: {
                    update: jest.fn(),
                },
            });
        }));
    }));
    it("should handle late returns and apply penalty", () => __awaiter(void 0, void 0, void 0, function* () {
        const requestBody = {
            memberId: 1,
            bookCodes: ["abc"],
        };
        mockTx.mockImplementation((callback) => __awaiter(void 0, void 0, void 0, function* () {
            yield callback({
                borrowing: {
                    findFirst: jest
                        .fn()
                        .mockResolvedValueOnce({
                        id: 1,
                        borrowedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                    }),
                    update: jest.fn().mockResolvedValue({ returnedAt: new Date() }),
                },
                member: {
                    update: jest.fn(),
                },
                book: {
                    update: jest.fn(),
                },
            });
            yield (0, returning_service_1.returningService)(requestBody);
        }));
        const result = yield (0, returning_service_1.returningService)(requestBody);
        expect(result.message).toBe("Transaction Success!");
        // expect(mockTx).toHaveBeenCalledTimes(1);
        // expect(scheduleJob).toHaveBeenCalled();
    }));
});
