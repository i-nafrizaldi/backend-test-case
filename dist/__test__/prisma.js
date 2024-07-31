"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaMock = void 0;
const jest_mock_extended_1 = require("jest-mock-extended");
// Pastikan import prisma dari path yang benar
const prisma_1 = require("../prisma");
// Ubah cara mock untuk prisma
jest.mock("../prisma", () => ({
    __esModule: true,
    prisma: (0, jest_mock_extended_1.mockDeep)(),
}));
exports.prismaMock = prisma_1.prisma;
beforeEach(() => {
    (0, jest_mock_extended_1.mockReset)(exports.prismaMock);
});
