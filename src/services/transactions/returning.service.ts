import { scheduleJob } from "node-schedule";
import { prisma } from "../../prisma";

interface Returning {
  memberId: number;
  bookCodes: string[];
}

export const returningService = async (body: Returning) => {
  try {
    const { bookCodes, memberId } = body;

    await prisma.$transaction(async (tx) => {
      const date = new Date(Date.now());

      for (const bookCode of bookCodes) {
        const book = await tx.borrowing.findFirst({
          where: {
            bookCode: bookCode,
            memberId: memberId,
            returnedAt: null,
          },
        });

        if (!book) {
          throw new Error(
            `Borrowing record not found for book code: ${bookCode}`
          );
        }

        const borrowingDate = new Date(book.borrowedAt);
        const isLateReturn =
          date.getTime() > borrowingDate.getTime() + 7 * 24 * 60 * 60 * 1000;

        await tx.borrowing.update({
          where: { id: book.id },
          data: { returnedAt: date },
        });

        if (isLateReturn) {
          await tx.member.update({
            where: { id: memberId },
            data: { isPenalty: true },
          });

          const scheduleAdmin = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
          scheduleJob(scheduleAdmin, async () => {
            await prisma.member.update({
              where: { id: memberId },
              data: { isPenalty: false },
            });
          });
        }

        await tx.book.update({
          where: { code: bookCode },
          data: { stock: { increment: 1 }, isBorrowed: false },
        });
      }
    });
    return { message: `Transaction Success!` };
  } catch (error) {
    throw error;
  }
};
