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
exports.borrowingService = void 0;
const prisma_1 = require("../../prisma");
const borrowingService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookCodes, memberId } = body;
        const existingMember = yield prisma_1.prisma.member.findFirst({
            where: { id: memberId },
        });
        if (!existingMember) {
            throw new Error("Member not found!");
        }
        if (existingMember.isPenalty) {
            throw new Error("Member is currently penalized!");
        }
        const borrowedCount = yield prisma_1.prisma.borrowing.count({
            where: { memberId: memberId, returnedAt: null },
        });
        if (borrowedCount >= 2 || bookCodes.length > 2) {
            throw new Error("Member cannot borrow more than 2 books!");
        }
        const books = yield prisma_1.prisma.book.findMany({
            where: {
                code: { in: bookCodes },
            },
        });
        if (books.length !== bookCodes.length) {
            throw new Error("One or more books not found!");
        }
        for (const book of books) {
            if (book.stock === 0) {
                throw new Error(`Book ${book.title} is out of stock!`);
            }
        }
        const borrow = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const borrowings = [];
            for (const book of books) {
                const borrowingBook = yield tx.borrowing.create({
                    data: {
                        memberId: memberId,
                        bookCode: book.code,
                        borrowedAt: new Date(),
                    },
                });
                yield tx.book.update({
                    where: { code: book.code },
                    data: { stock: { decrement: 1 }, isBorrowed: true },
                });
                borrowings.push(borrowingBook);
            }
            return borrowings;
        }));
        return { message: "Transaction Success!", data: borrow };
    }
    catch (error) {
        throw error;
    }
});
exports.borrowingService = borrowingService;
