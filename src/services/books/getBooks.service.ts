import { prisma } from "../../prisma";

export const getBooksService = async () => {
  try {
    const books = await prisma.book.findMany({
      where: {
        isBorrowed: false,
      },
    });
    return {
      data: books,
    };
  } catch (error) {
    throw error;
  }
};
