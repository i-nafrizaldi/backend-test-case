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
exports.returningService = void 0;
const node_schedule_1 = require("node-schedule");
const prisma_1 = require("../../prisma");
const returningService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookCodes, memberId } = body;
        yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(Date.now());
            for (const bookCode of bookCodes) {
                const book = yield tx.borrowing.findFirst({
                    where: {
                        bookCode: bookCode,
                        memberId: memberId,
                        returnedAt: null,
                    },
                });
                if (!book) {
                    throw new Error(`Borrowing record not found for book code: ${bookCode}`);
                }
                const borrowingDate = new Date(book.borrowedAt);
                const isLateReturn = date.getTime() > borrowingDate.getTime() + 7 * 24 * 60 * 60 * 1000;
                yield tx.borrowing.update({
                    where: { id: book.id },
                    data: { returnedAt: date },
                });
                if (isLateReturn) {
                    yield tx.member.update({
                        where: { id: memberId },
                        data: { isPenalty: true },
                    });
                    const scheduleAdmin = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
                    (0, node_schedule_1.scheduleJob)(scheduleAdmin, () => __awaiter(void 0, void 0, void 0, function* () {
                        yield prisma_1.prisma.member.update({
                            where: { id: memberId },
                            data: { isPenalty: false },
                        });
                    }));
                }
                yield tx.book.update({
                    where: { code: bookCode },
                    data: { stock: { increment: 1 } },
                });
            }
        }));
        return { message: `Transaction Success!` };
    }
    catch (error) {
        throw error;
    }
});
exports.returningService = returningService;
