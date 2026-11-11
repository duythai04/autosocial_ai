import bcrypt from "bcryptjs";
import prisma from "../config/prisma";

import {
  createAccessToken,
  createRefreshToken,
  hashToken,
} from "../utils/tokens";

const REFRESH_TOKEN_DAYS = 7;

function getRefreshExpiry() {
  const expiresAt = new Date();

  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_DAYS);

  return expiresAt;
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("EMAIL_EXISTS");
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error) {
    // Unique constraint vẫn có thể xảy ra khi hai request
    // đăng ký cùng một email đồng thời.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      throw new Error("EMAIL_EXISTS");
    }

    throw error;
  }
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);

  if (!validPassword) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const accessToken = createAccessToken(user.id);
  const refreshToken = createRefreshToken();

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: getRefreshExpiry(),
    },
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
}

export async function refreshSession(rawToken: string) {
  const tokenHash = hashToken(rawToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: { tokenHash },
  });

  if (
    !storedToken ||
    storedToken.revokedAt ||
    storedToken.expiresAt <= new Date()
  ) {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  const newRefreshToken = createRefreshToken();

  // Chỉ một request có thể xoay vòng token thành công.
  const result = await prisma.refreshToken.updateMany({
    where: {
      id: storedToken.id,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    data: {
      revokedAt: new Date(),
    },
  });

  if (result.count !== 1) {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  await prisma.refreshToken.create({
    data: {
      userId: storedToken.userId,
      tokenHash: hashToken(newRefreshToken),
      expiresAt: getRefreshExpiry(),
    },
  });

  return {
    accessToken: createAccessToken(storedToken.userId),
    refreshToken: newRefreshToken,
  };
}

export async function logoutUser(rawToken: string) {
  await prisma.refreshToken.updateMany({
    where: {
      tokenHash: hashToken(rawToken),
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}
