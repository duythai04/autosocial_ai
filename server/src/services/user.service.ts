import prisma from "../config/prisma";

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
};
