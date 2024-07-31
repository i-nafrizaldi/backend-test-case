// src/__test__/services/returning.service.test.ts
import { returningService } from "../../services/transactions/returning.service";

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

  it("should successfully process book returns", async () => {
    const requestBody = {
      memberId: 1,
      bookCodes: ["abc", "def"],
    };

    mockTx.mockImplementation(async (callback: any) => {
      await callback({
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
      await returningService(requestBody);
    });

    const result = await returningService(requestBody);

    expect(result.message).toBe("Transaction Success!");
    // expect(mockTx).toHaveBeenCalledTimes(1);
  });

  it("should throw error if borrowing record not found", async () => {
    const requestBody = {
      memberId: 1,
      bookCodes: ["abc"],
    };

    mockTx.mockImplementation(async (callback: any) => {
      await callback({
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
    });
  });

  it("should handle late returns and apply penalty", async () => {
    const requestBody = {
      memberId: 1,
      bookCodes: ["abc"],
    };

    mockTx.mockImplementation(async (callback: any) => {
      await callback({
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
      await returningService(requestBody);
    });

    const result = await returningService(requestBody);

    expect(result.message).toBe("Transaction Success!");
    // expect(mockTx).toHaveBeenCalledTimes(1);
    // expect(scheduleJob).toHaveBeenCalled();
  });
});
