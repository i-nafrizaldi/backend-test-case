import { prisma } from "../../prisma";

export const getMembersService = async () => {
  try {
    const members = await prisma.member.findMany({
      include: {
        borrowings: true,
      },
    });
    return {
      data: members,
    };
  } catch (error) {
    throw error;
  }
};
