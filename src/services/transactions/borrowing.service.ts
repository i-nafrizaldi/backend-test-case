import { prisma } from "../../prisma";

interface Borrowing {
  memberId: number;
  bookCodes: string[];
}

export const borrowingService = async (body: Borrowing) => {
  try {
    const { bookCodes, memberId } = body;

    const existingMember = await prisma.member.findFirst({
      where: { id: memberId },
    });

    if (!existingMember) {
      throw new Error("Member not found!");
    }

    if (existingMember.isPenalty) {
      throw new Error("Member is currently penalized!");
    }

    const borrowedCount = await prisma.borrowing.count({
      where: { memberId: memberId, returnedAt: null },
    });

    if (borrowedCount >= 2 || bookCodes.length > 2) {
      throw new Error("Member cannot borrow more than 2 books!");
    }

    const books = await prisma.book.findMany({
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

    const borrow = await prisma.$transaction(async (tx) => {
      const borrowings = [];

      for (const book of books) {
        const borrowingBook = await tx.borrowing.create({
          data: {
            memberId: memberId,
            bookCode: book.code,
            borrowedAt: new Date(),
          },
        });

        await tx.book.update({
          where: { code: book.code },
          data: { stock: { decrement: 1 }, isBorrowed: true },
        });

        borrowings.push(borrowingBook);
      }

      return borrowings;
    });
    return { message: "Transaction Success!", data: borrow };
  } catch (error) {
    throw error;
  }
};
