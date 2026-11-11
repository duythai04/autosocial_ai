import jwt from "jsonwebtoken";
import crypto from "node:crypto";

function getAccessSecret() {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("JWT_ACCESS_SECRET is missing or too short");
  }

  return secret;
}

export function createAccessToken(userId: string) {
  return jwt.sign({ sub: userId }, getAccessSecret(), {
    expiresIn: "15m",
    algorithm: "HS256",
  });
}

export function verifyAccessToken(token: string) {
  const payload = jwt.verify(token, getAccessSecret(), {
    algorithms: ["HS256"],
  });

  if (typeof payload === "string" || typeof payload.sub !== "string") {
    throw new Error("Invalid access token");
  }

  return payload.sub;
}

export function createRefreshToken() {
  return crypto.randomBytes(48).toString("hex");
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
